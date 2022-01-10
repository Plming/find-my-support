import { Request, Response } from "express";

import * as db from "../database";
import * as cache from "../cache";

export async function getResult(req: Request, res: Response) {
    // 1. 모든 서비스들의 지원 조건 정보 가져오기
    const conditions: SupportConditionsModel[] = await cache.getSupportConditions();

    // 2. 그 중에서 이용가능한 서비스만 뽑아내기
    const availableServiceIdList: string[] = [];
    for (const c of conditions) {
        if (isAvailable(req.query, c)) {
            availableServiceIdList.push(c["SVC_ID"]);
        }
    }

    // 3. 이용가능한 서비스들의 상세 내용 가져오기
    const availableServices: ServiceDetailModel[] = [];
    for (const serviceId of availableServiceIdList) {
        const matched = await db.serviceDetail.findOne({ SVC_ID: serviceId });
        if (matched !== null) {
            availableServices.push(matched);
        }
    }

    res.render("result", { availableServices: availableServices });
};

// TODO: any 타입 수정하기
function isAvailable(conditionQuery: any, conditions: any): boolean {
    const birthdate = new Date(conditionQuery.birthday);
    conditionQuery.age = new Date().getFullYear() - birthdate.getFullYear() + 1;

    //#region checkGender
    if (conditions[conditionQuery["gender"]] !== "Y") {
        return false;
    }
    //#endregion

    //#region checkAge
    // JA0103 ~ JA0109 (age level param) seems not to be used.
    if (
        conditionQuery["age"] < conditions["JA0110"] ||
        conditionQuery["age"] > conditions["JA0111"]
    ) {
        return false;
    }
    //#endregion

    //#region checkIncomeLevel
    if (conditions[conditionQuery["income"]] !== "Y") {
        return false;
    }
    //#endregion

    //#region checkPersonalAttributes
    // JA03XX is personal attribute
    {
        const myPersonalAttributes = Object.keys(conditionQuery).filter((v) =>
            v.startsWith("JA03")
        );
        const intersectedAttributes = myPersonalAttributes.filter(
            (a) => conditions[a] === "Y"
        );
        if (intersectedAttributes.length === 0) {
            return false;
        }
    }
    //#endregion

    //#region checkFamilyAttributes
    // JA04XX is family attribute
    {
        const myFamilyAttributes = Object.keys(conditionQuery).filter((v) =>
            v.startsWith("JA04")
        );
        const intersectedAttributes = myFamilyAttributes.filter(
            (a) => conditions[a] === "Y"
        );
        if (intersectedAttributes.length === 0) {
            return false;
        }
    }
    //#endregion

    return true;
}

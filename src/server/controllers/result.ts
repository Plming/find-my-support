import { Request, Response } from "express";
import { Filter } from "mongodb";

import { supportConditions } from "../database";

export default async function getResult(req: Request, res: Response) {
    // 1. query string의 정보 가공하기
    const userInformation = {
        gender: req.query["gender"] as string,
        age: new Date().getFullYear() - new Date(req.query["birthdate"] as string).getFullYear() + 1,
        income: req.query["income"] as string,
        personalAttributes: new Array<string>(),
        familyAttributes: new Array<string>()
    }

    Object.keys(req.query).forEach(key => {
        if (key.startsWith("JA03")) {
            userInformation.personalAttributes.push(key);
        } else if (key.startsWith("JA04")) {
            userInformation.familyAttributes.push(key);
        }
    });

    // 2. 쿼리 만들기
    const filter: Filter<SupportConditionsModel> = {
        [userInformation.gender]: "Y",
        [userInformation.income]: "Y",
        $or: [
            {
                JA0110: { $lte: userInformation.age },
                JA0111: { $gte: userInformation.age }
            },
            {
                [getAgeCategory(userInformation.age)]: "Y"
            }
        ]
    };

    for (const attr of userInformation.personalAttributes) {
        filter[attr] = "Y";
    }

    for (const attr of userInformation.familyAttributes) {
        filter[attr] = "Y";
    }

    // 3. 조인하여 결과 가져오기
    const cursor = supportConditions.aggregate()
        .match(filter)
        .project({
            _id: true
        })
        .lookup({
            from: "serviceDetail",
            localField: "_id",
            foreignField: "_id",
            as: "serviceDetail"
        });

    const availableServices = await cursor.toArray();
    res.render("result", { availableServices: availableServices });
};

function getAgeCategory(age: number): string {
    if (age >= 65) {
        return "JA0109";
    }
    else if (age >= 50) {
        return "JA0108";
    }
    else if (age >= 30) {
        return "JA0107";
    }
    else if (age >= 19) {
        return "JA0106";
    }
    else if (age >= 13) {
        return "JA0105";
    }
    else if (age >= 6) {
        return "JA0104";
    }
    else {
        return "JA0103";
    }
}
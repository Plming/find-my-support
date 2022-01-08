export default function isAvailable(conditionQuery: any, conditions: any): boolean {
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

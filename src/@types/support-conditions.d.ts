declare interface SupportConditionsApi {
    page: number,
    perPage: number,
    totalCount: number,
    currentCount: number,
    data: SupportConditionsModel[]
}

declare interface SupportConditionsModel {
    /** 공공서비스 고유 식별자 */
    SVC_ID: string,

    /** 남성 */
    JA0101: string,

    /** 여성 */
    JA0102: string,

    /** 영유아(0~5) */
    JA0103: string,

    /** 아동(6~12) */
    JA0104: string,

    /** 청소년(13~18) */
    JA0105: string,

    /** 청년(19~29) */
    JA0106: string,

    /** 중년(30~49) */
    JA0107: string,

    /** 장년(50~64) */
    JA0108: string,

    /** 노년기(65~) */
    JA0109: string,

    /** 대상연령(시작) */
    JA0110: string,

    /** 대상연령(종료) */
    JA0111: string,

    /** 0 ~ 50 */
    JA0201: string,

    /** 51 ~ 75 */
    JA0202: string,

    /** 76 ~ 100 */
    JA0203: string,

    /** 101 ~ 200 */
    JA0204: string,

    /** 200% 초과 */
    JA0205: string,

    /** 예비부모/난임 */
    JA0301: string,

    /** 임신부 */
    JA0302: string,

    /** 출산/입양 */
    JA0303: string,

    /** 심한 장애 */
    JA0304: string,

    /** 심하지 않은 장애 */
    JA0305: string,

    /** 독립유공자 */
    JA0306: string,

    /** 국가유공자 */
    JA0307: string,

    /** 참전유공자 */
    JA0308: string,

    /** 보훈보상대상자 */
    JA0309: string,

    /** 특수임무유공자 */
    JA0310: string,

    /** 5·18민주유공자 */
    JA0311: string,

    /** 제대군인 */
    JA0312: string,

    /** 농업인 */
    JA0313: string,

    /** 어업인 */
    JA0314: string,

    /** 축산업인 */
    JA0315: string,

    /** 임업인 */
    JA0316: string,

    /** 초등학생 */
    JA0317: string,

    /** 중학생 */
    JA0318: string,

    /** 고등학생 */
    JA0319: string,

    /** 대학생/대학원생 */
    JA0320: string,

    /** 해당사항없음 */
    JA0322: string,

    /** 질병/부상/질환자 */
    JA0323: string,

    /** 중증·난치·희귀질환자 */
    JA0324: string,

    /** 요양환자/치매환자 */
    JA0325: string,

    /** 근로자/직장인 */
    JA0326: string,

    /** 구직자/실업자 */
    JA0327: string,

    /** 다문화가족 */
    JA0401: string,

    /** 북한이탈주민 */
    JA0402: string,

    /** 한부모가정/조손가정 */
    JA0403: string,

    /** 1인가구 */
    JA0404: string,

    /** 해당사항없음 */
    JA0410: string,

    /** 다자녀가구 */
    JA0411: string,

    /** 무주택세대 */
    JA0412: string,

    /** 신규전입 */
    JA0413: string,

    /** 확대가족 */
    JA0414: string
}
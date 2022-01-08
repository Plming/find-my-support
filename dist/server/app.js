"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const process_1 = __importDefault(require("process"));
const isAvailable_1 = __importDefault(require("./isAvailable"));
const cache_1 = __importDefault(require("./cache"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = (_a = process_1.default.env.PORT) !== null && _a !== void 0 ? _a : 3000;
// app configs
app.use("/public", express_1.default.static(__dirname + "/public"));
app.set("views", "views");
app.set("view engine", "ejs");
// routes
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/entry", (req, res) => {
    res.render("entry");
});
app.get("/result", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const availableServices = [];
    const conditions = yield cache_1.default.getSupportConditions();
    for (const c of conditions) {
        if ((0, isAvailable_1.default)(req.query, c)) {
            availableServices.push(c["SVC_ID"]);
        }
    }
    const details = [];
    for (const s of availableServices) {
        const item = yield cache_1.default.getServiceDetail(s);
        if (item !== undefined) {
            details.push(item);
            console.log(JSON.stringify(item));
        }
    }
    res.render("result", { serviceList: details });
}));
app.listen(port, () => {
    if (process_1.default.env.API_AUTH_KEY === undefined) {
        console.error("There's no API_AUTH_KEY in .env file!");
        process_1.default.exit(1);
    }
    console.log(`Express app is running on http://find-my-support.herokuapp.com`);
});

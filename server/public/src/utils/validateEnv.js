"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    (0, envalid_1.cleanEnv)(process.env, {
        MONGO_PASSWORD: (0, envalid_1.str)(),
        MONGO_PATH: (0, envalid_1.str)(),
        MONGO_USER: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)(),
    });
}
exports.default = validateEnv;

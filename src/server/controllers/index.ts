import { Request, Response } from "express";

export function getIndex(req: Request, res: Response) {
    res.render("index");
}

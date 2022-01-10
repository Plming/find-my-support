import { Request, Response } from "express";

export function getEntry(req: Request, res: Response) {
    res.render("entry");
};

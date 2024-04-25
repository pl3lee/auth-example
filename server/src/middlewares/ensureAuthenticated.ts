import express, { NextFunction, Request, Response } from 'express';
import { lucia } from '../lucia/lucia.ts';
export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies.auth_session ?? null;
    if (!sessionId) {
        return res.status(401).json({ error: "No session stored in cookies" });
    }
    const result = await lucia.validateSession(sessionId);
    if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        return next();
    }
    if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        return res.status(402).json(result)
    }
    return next();
}
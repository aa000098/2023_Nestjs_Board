import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const {ip, method, originalUrl} = req;
        const userAgent = req.get('user-agent') || '';
        
        res.on('finish', ()=> {
            const {statusCode} = res;
            this.logger.log(
                `${method} ${originalUrl} has been executed ${statusCode} - ${userAgent} ${ip} ${new Date().toLocaleDateString('kr')}`
            )
        })
        
        next();
    }
}
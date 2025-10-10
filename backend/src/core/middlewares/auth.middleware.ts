import { JwtService } from '@nestjs/jwt';

export function authMiddleware(jwtService: JwtService) {
    return (req, resp, next) => {
        const token = req.headers['authorization']?.replace('Bearer ', '');

        //si pas de token, on passe au middleware suivent
        if (!token) return next();

        try {
            const payload = jwtService.verify(token);
            req['user'] = payload;

            return next();
        } catch (err) {
            resp.sendStatus(401).end();
        }
    };
}

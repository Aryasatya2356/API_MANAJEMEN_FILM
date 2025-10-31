const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Akses ditolak, token tidak ditemukan' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodePayload) => {
        if (err){
            console.error("JWT verify Error:", err.message);
            return res.status(403).json({ error: 'Token tidak valid atau kadaluwarsa'});
        }
        req.user = decodePayload.user;
        next();
    });
}

module.exports = authenticateToken;
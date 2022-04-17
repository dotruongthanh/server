
const jwt= require("jsonwebtoken")

// xac minh ma thong bao

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) res.status(403).json("Token is not valid!");
        req.user = user; // tao thành cong
        next(); // rời khỏ chức năng này và chuyển sang userr tiếp tuc chay
      });
    } else {
      return res.status(401).json("Tài khoản không tồn tại!"); // ko xac thuc dc 
    }
  };


  const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("Không thành công. Vui lòng thử lại!");
      }
    });
  };

  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if ( req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("Không thành công. Vui lòng thử lại!");
      }
    });
  };

module.exports = {verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin };
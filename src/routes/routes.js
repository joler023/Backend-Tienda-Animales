import { Router } from "express";
import LoginController from "../controllers/LoginController.js";

const router = Router();
router.post("/login", LoginController.login);
router.post("/register", LoginController.auth);
router.get("/signned", (req, res) => {
  if (req.session.loggedin) {
    return res.json({
      message: "su sesion esta abierta",
      auth: true,
    });
  }
  return res.status(500).json({
    message: "su sesion no esta abierta",
    auth: false,
  });
});
router.get("/logout",(req,res)=>{
  req.session.destroy();
  res.json({auth: false})
})

export default router;

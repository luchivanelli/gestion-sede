import express from 'express';
import { login } from '../controllers/loginController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { getMembers } from '../controllers/homeController.js';
import { addMember } from '../controllers/addMemberController.js';
import { editMember } from '../controllers/editMemberController.js';
import { deactiveMember } from '../controllers/deactiveMember.js';
import { getCards } from '../controllers/getCardsController.js';
import { editCard } from '../controllers/editCardController.js';
import { addCard } from '../controllers/addCardController.js';
import { addPayment } from '../controllers/addPaymentController.js';
import { getPayments } from '../controllers/getPaymentsController.js';
import { deletePayment } from '../controllers/deletePaymentControllers.js';

export const router = express.Router()

router.get("/", verifyToken, getMembers)
router.put("/:id", verifyToken, deactiveMember)
router.post("/add-member", verifyToken, addMember)
router.patch("/edit-member/:id", verifyToken, editMember)

router.get("/cards", verifyToken, getCards)
router.post("/cards/add-card", verifyToken, addCard)
router.patch("/cards/edit-card/:id", verifyToken, editCard)

router.get("/payments", verifyToken, getPayments)
router.post("/payments/add-payment", verifyToken, addPayment)
router.delete("/payments/:id", verifyToken, deletePayment)

router.post("/login", login)
router.get("/login", (req, res) => {
    res.json({message: "conexion exitosa"});
})


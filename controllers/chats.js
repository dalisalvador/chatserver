const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Chat = require("../models/Chat");

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private
exports.createChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.create(req.body);

  res.status(200).json({
    success: true,
    data: chat
  });
});

// @desc      Get all clientes
// @route     GET /api/v1/clientes
// @access    Public
// exports.getClientes = asyncHandler(async (req, res, next) => {
//   const clientes = await Cliente.find({}).populate({
//     path: "unidadesFuncionales",
//     model: "UnidadFuncional",
//     populate: {
//       path: "consorcio",
//       model: "Consorcio",
//       select: ["nombre"]
//     }
//   });
//   if (!clientes) {
//     return next(new ErrorResponse("No se encontraron clientes", 404));
//   }

//   res.status(200).json({ success: true, data: clientes });
// });

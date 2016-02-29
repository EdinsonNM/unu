module.exports = {
    title: "Ingresante-Pago",
    description: "Valida pago individual de un ingresante",
    type: "object",
    properties: {
        _ingresante: {
            "type": "String"
        },
        compromisoPagoId: {
            "type": "String"
        },
        nroOperacion: {
            "type": "String"
        },
        fechaPago: {
            "type": "String"
        },
        montoPagado: {
            "type": "String"
        },
        mora: {
            "type": "String"
        },
        oficinaPago: {
            "type": "String"
        }

    },
    required: ["_ingresante","compromisoPagoId","nroOperacion","fechaPago","montoPagado","mora","oficinaPago"]
};

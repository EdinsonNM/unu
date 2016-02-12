module.exports = {
    title: "Ingresante-Pago",
    description: "Valida pago individual de un ingresante",
    type: "object",
    properties: {
        _ingresante: {
            "type": "String"
        },
        voucher:{
          type:'String'
        },
        monto:{
          type:'Number'
        },
        fecha:{
          type:'Date'
        }

    },
    required: ["_ingresante","monto","voucher","fecha"]
};

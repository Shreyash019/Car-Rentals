import mongoose from 'mongoose';


const carSchema = new mongoose.Schema(
    {
        carName: {
            type: String,
            required: true,
        },
        carModel: {
            type: String,
            required: true,
        },
        carCompany: {
            type: String,
            required: true,
        },
        carPicture: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        carCategory: {
            type: String,
            required: true,
        },
        carEngine: {
            type: String,
            required: true,
        },
        carMileage: {
            type: String,
            required: true,
        },
        carSeatCapacity: {
            type: Number,
            required: true,
        },
        carFuelType: {
            type: String,
            required: true,
        },
        carTransmission: {
            type: String,
            required: true,
        },
        rentalPriceCharge: {
            type: Number,
            required: true,
        },
        order: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
            },
        ],
        payment: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payment',
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timeStamps: true,        
        toJSON: { virtuals: true },
    }
)

const Car = mongoose.model('Car', carSchema)

export default Car;
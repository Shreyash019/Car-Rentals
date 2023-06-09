import ErrorHandler from '../utils/errorHandler.js';
import CatchAsync from '../middlewares/catchAsync.js'
import Car from '../models/Car.js';
import cloudinary from 'cloudinary';


// 1) --------------| Car Upload By Admin |--------------
export const carRental_Car_Details_Upload_By_Admin = CatchAsync(async(req, res, next)=>{
    // a) Destructuring of data
    const {carName, carModel, carCompany, carImage, carCategory, carEngine, carMileage, carSeatCapacity, carFuelType, carTransmission, rentalPriceCharge } = req.body;
    
    // b) Checking if all required fields have been provided or not
    if(!carName || !carModel || !carCompany || !carImage || !carCategory || !carEngine || !carMileage || !carSeatCapacity || !carFuelType || !carTransmission || !rentalPriceCharge){
        return res.send('Please enter all details of a car.')
    }

    // c) If all fields are ok then setting car images for uploading
    let carPicture = [];
    if (typeof carImage === "string") {
        carPicture.push(carImage);
    } else {
        carPicture = carImage;
    }
    const imagesLink = [];
    for (let i = 0; i < carPicture.length; i++) {
        const result = await cloudinary.v2.uploader.upload(carPicture[i], {
            folder: "products",
        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.carPicture = imagesLink
    req.body.user = req.user.id;

    // d) Now saving car details in database
    const car = await Car.create({
        carName: req.body.carName,
        carModel: req.body.carModel,
        carCompany: req.body.carCompany,
        carPicture: req.body.carPicture,
        carCategory: req.body.carCategory,
        carEngine: req.body.carEngine,
        carMileage: req.body.carMileage,
        carSeatCapacity: req.body.carSeatCapacity,
        carFuelType: req.body.carFuelType,
        carTransmission: req.body.carTransmission,
        rentalPriceCharge: req.body.rentalPriceCharge,
        user: req.body.user
    })
    // e) Sending response
    const cars = await Car.find()
    return res.status(200).json({
        success: true,
        message: 'Car registed.',
        cars
    })
})

// 2) --------------| Get All Cars |--------------
export const carRental_get_All_Cars = CatchAsync(async(req, res, next)=>{

    const cars = await Car.find();

    if(!cars){
        return next(new ErrorHandler(`Some error occurs`, 400))
    }

    return res.status(200).json({
        success: true,
        message: 'All cars.',
        length: cars.length,
        cars
    })
})

// 3) --------------| Get Single Car |--------------
export const carRental_get_Single_Car = CatchAsync(async(req, res, next)=>{

    const carID = req.params.id
    const car = await Car.findById({_id: carID});

    if(!car){
        return next(new ErrorHandler(`Car doesn't exist`, 400))
    }

    return res.status(200).json({
        success: true,
        message: 'Car Found.',
        car
    })
})

// 4) --------------| Upadate Car Detail |--------------
export const carRental_Update_A_Car_Detail = CatchAsync(async(req, res, next)=>{

    const carID = req.params.id

    const carFetched = await Car.findById({_id: carID});

    if(!carFetched){
        return next(new ErrorHandler(`Car doesn't exist`, 400))
    }
    const car = await carFetched.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    return res.status(200).json({
        success: true,
        message: 'Car Found.',
        car
    })
})

// 5) --------------| Delete a Car Detail |--------------
export const carRental_Delate_A_Car_Uploaded = CatchAsync(async(req, res, next)=>{

    const carID = req.params.id
    const car = await Car.findById({_id: carID});
    if(!car){
        return next(new ErrorHandler(`Car doesn't exist`, 400))
    }
    for (let i = 0; i < car.carPicture.length; i++) {
        await cloudinary.v2.uploader.destroy(car.carPicture[i].public_id);
    }
    await Car.findByIdAndDelete(req.params.id)
    const cars = await Car.find()
    return res.status(200).json({
        success: true,
        message: 'Car detail delated.',
        cars
    })
})
import Cors from 'cors';

// init
const initMiddleware = (middleware: any) => {

    return (req:any, res:any) => {
        new Promise((resolve, reject) => {
            middleware(req, res, (result: any) => {
                if (result instanceof Error) {
                    // RETURN AS ERROR STATE
                    return reject(result)
                }
                
                // IF NOT IN ERROR STATE RETURN AS SUCCESS STATE
                return resolve(result)
            })
        })
    }
}

// creating cors

const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*' // DOMAIN
})

export { initMiddleware, cors } 
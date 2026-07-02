// import type { Request, Response, NextFunction } from "express";
// import { bedQueries, createBeds, updateBed } from "./bed.validator";
// import { ApplicationError } from "@/middleware/errorHandler";
// import BedService from "./bed.service";

// export default class BedController {
//   bedService;

//   constructor() {
//     this.bedService = new BedService();
//   }

//   async getBeds(req: Request, res: Response, next: NextFunction) {
//     try {
//       const queries = bedQueries.parse(req.query);
//       const beds = await this.bedService.getBeds(queries);
//       return res.status(200).json({ data: beds });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getBedById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const id = Number(req.params.id);
//       if (isNaN(id)) throw new ApplicationError("Invalid bed ID", 400);

//       const bed = await this.bedService.getBedById(id);
//       return res.status(200).json({ data: bed });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async createBeds(req: Request, res: Response, next: NextFunction) {
//     try {
//       const payload = createBeds.parse(req.body);
//       const beds = await this.bedService.createBeds(payload);
//       return res.status(201).json({
//         message: `${beds.length} bed(s) created successfully`,
//         data: beds,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async updateBed(req: Request, res: Response, next: NextFunction) {
//     try {
//       const id = Number(req.params.id);
//       if (isNaN(id)) throw new ApplicationError("Invalid bed ID", 400);

//       const payload = updateBed.parse(req.body);
//       const bed = await this.bedService.updateBed(id, payload);
//       return res.status(200).json({
//         message: "Bed updated successfully",
//         data: bed,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async deleteBed(req: Request, res: Response, next: NextFunction) {
//     try {
//       const id = Number(req.params.id);
//       if (isNaN(id)) throw new ApplicationError("Invalid bed ID", 400);

//       await this.bedService.deleteBed(id);
//       return res.status(200).json({ message: "Bed deleted successfully" });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

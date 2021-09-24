import express from "express"
import multer from "multer"
import uniqid from "uniqid"
import { join } from "path"
import createHttpError from "http-errors"
import { getMedia, writeMedia, } from "../../lib/fs-tools.js"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const mediaRouter = express.Router()
const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "M5-D10-BM",
    },
})

mediaRouter.post("/", async (req, res, next) => {
    try {
        const newMedia = { imdbID: uniqid(), ...req.body, createdAt: new Date() }
        const mediaList = await getMedia()
        mediaList.push(newMedia)
        writeMedia(mediaList)
        res.status(201).send({ imdbID: newMedia.imdbID })
    } catch (error) {
        next(error)
    }
})

mediaRouter.get("/", async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        res.send(mediaList)
    } catch (error) {
        next(error)
    }
})

mediaRouter.get("/:id", async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const media = mediaList.find(media => media.imdbID === req.params.id)
        if (media) {
            res.send(media)
        } else {
            next(createHttpError(404, `media with ID ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

mediaRouter.put("/:id", async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const index = mediaList.findIndex(media => media.imdbID === req.params.id)
        const mediaToModify = mediaList[index]
        const updatedFields = req.body
        const updatedMedia = { ...mediaToModify, ...updatedFields }
        mediaList[index] = updatedMedia
        writeMedia(mediaList)
        res.send(updatedMedia)
    } catch (error) {
        next(error)
    }
})

mediaRouter.delete("/:id", async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const filteredMedia = mediaList.filter(media => media.imdbID !== req.params.id)
        writeMedia(filteredMedia)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

mediaRouter.post("/:id/poster", multer({ storage: cloudStorage }).single("poster"), async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const Poster = req.file.path
        const index = mediaList.findIndex(media => media.imdbID === req.params.id)
        const mediaToModify = mediaList[index]
        const updatedMedia = { ...mediaToModify, Poster }
        mediaList[index] = updatedMedia
        writeMedia(mediaList)
        res.send(updatedMedia)
    } catch (error) {
        next(error)
    }
})

mediaRouter.post("/:id/reviews", async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const index = mediaList.findIndex(media => media.imdbID === req.params.id)
        const mediaToModify = mediaList[index]
        const newReview = { _id: uniqid(), ...req.body, elementId: req.params.id, createdAt: new Date() }
        mediaToModify.Reviews.push(newReview)
        mediaList[index] = mediaToModify
        writeMedia(mediaList)
        res.send(mediaToModify)
    } catch (error) {
        next(error)
    }
})

mediaRouter.delete("/:id/reviews", async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const index = mediaList.findIndex(media => media.imdbID === req.params.id)
        const mediaToModify = mediaList[index]
        mediaToModify.Reviews = []
        mediaList[index] = mediaToModify
        writeMedia(mediaList)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default mediaRouter
import Elysia, { t } from "elysia";
import { readFile, readFileSync } from "fs";
import CollectionService from "../service/collection.service";

export const CollectionController = new Elysia();
const collectionService = new CollectionService();

CollectionController
    .model({
        collection: t.Object({
            file: t.File(),
            idUser: t.String(),
            category: t.String(),
            name: t.String()
        })
    })
    .post('v1/collection/addCollection', async ({ body: { file, idUser, category, name } }) => {
        try {
            if (file && file instanceof Blob) {
                const buffer = await file.arrayBuffer();
                const base64String = Buffer.from(buffer).toString("base64");
                const col = await collectionService.createCollection(base64String, idUser, category, name);
                return col;
            }
        } catch (e) {
            console.log(e)
        }

    }, {
        body: 'collection',
        detail: { tags: ['Collection'] }
    })
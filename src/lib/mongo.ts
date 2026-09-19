import { MongoClient, type Collection, type Db, ObjectId } from "mongodb"

type MongoGlobal = {
    mongoClientPromise?: Promise<MongoClient>
}

const globalForMongo = globalThis as typeof globalThis & MongoGlobal

export const mongoUri = process.env.DATABASE_URL ?? "mongodb://127.0.0.1:27017/strix"

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = mongoUri
}

const mongoClientPromise = globalForMongo.mongoClientPromise ?? new MongoClient(mongoUri).connect()

if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClientPromise = mongoClientPromise
}

export async function getMongoClient() {
    return mongoClientPromise
}

export async function getMongoDatabase(): Promise<Db> {
    const client = await mongoClientPromise
    return client.db()
}

export async function getMongoCollection<T extends object>(name: string): Promise<Collection<T>> {
    const database = await getMongoDatabase()
    return database.collection<T>(name)
}

export { ObjectId }
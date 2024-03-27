import type { MongoClient } from 'mongodb'
import { GridFSBucket, ObjectId } from 'mongodb'

interface FileUpload {
  db: string
  bucketName: string
  file: Express.Multer.File
  metadata?: object
}

export async function uploadFile(mongoClient: MongoClient, { db, bucketName, file, metadata }: FileUpload): Promise<object> {
  const bucket = new GridFSBucket(mongoClient.db(db), {
    bucketName,
  })

  const cursor = bucket.find({
    filename: file.originalname
  });
  for await (let doc of cursor) {
    if (doc) {
      await bucket.delete(doc._id)
      console.log(`Deleted old file: ${doc._id}`)
    }
  }
  let writestream = bucket.openUploadStream(file.originalname, {
    chunkSizeBytes: 102400,
    contentType: file.mimetype,
    metadata: {
      ...metadata,
      mimetype: file.mimetype,
    },
  })
  writestream.on('close', () => {
    console.log(`File uploaded successfully fileName: ${file.originalname}`);
  });
  writestream.write(file.buffer);
  writestream.end();

  return {
    bucketName,
    chunkSize: 102400,
    originalname: file.originalname,
    encoding: file.encoding,
    filename: file.originalname,
    size: writestream.chunkSizeBytes,
    uploadDate: new Date().toISOString(),
    mimetype: file.mimetype,
    id: writestream.id,
  }
}

export async function downloadFile(mongoClient: MongoClient, { db, bucketName, filename }: { db: string; bucketName: string; filename: string }) {
  const bucket = new GridFSBucket(mongoClient.db(db), {
    bucketName,
  })

  const cursor = bucket.find({
    filename: filename
  });
  let kq: any = {
    status: 404,
    msg: "File not found"
  }
  for await (let doc of cursor) {
    if (doc) {
      let file = bucket.openDownloadStreamByName(filename)
      kq = {
        status: 200,
        file,
        mimetype: doc.contentType
      }
      break;
    }
  }
  return kq
}
export function downloadFileByID(mongoClient: MongoClient, { db, bucketName, fileID }: { db: string; bucketName: string; fileID: string }) {
  const bucket = new GridFSBucket(mongoClient.db(db), {
    bucketName,
  })
  return bucket.openDownloadStream(new ObjectId(fileID))
}
export async function deleteFileById(mongoClient: MongoClient, { db, bucketName, fileID }: { db: string; bucketName: string; fileID: string }) {
  const bucket = new GridFSBucket(mongoClient.db(db), {
    bucketName,
  })
  if (!fileID) {
    return {
      status: 400,
      msg: "FileID not found"
    }
  }
  console.warn(fileID);
  const cursor = bucket.find({
    _id: new ObjectId(fileID)
  });
  let kq: any = {
    status: 404,
    msg: "File not found"
  }
  for await (let doc of cursor) {
    if (doc) {
      bucket.delete(doc._id)
      console.log(`Delete file, bucket: ${bucketName}, id: ${fileID}`);
      kq = {
        status: 200,
      }
    }
  }
  return kq
}

// export default { uploadFile, downloadFile, deleteFileById, downloadFileByID }

// _clientGridFS

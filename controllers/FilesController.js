/* eslint-disable no-param-reassign */
import { contentType } from 'mime-types';
import dbClient from '../utils/db';
import Utility from './UtilController';

export default class FileHandler {
  static async uploadFile(req, res) {
    const userId = req.user.id;
    const {
      name, type, parentId, isPublic, data,
    } = req.body;

    if (!name || !type || (!['folder', 'file', 'image'].includes(type)) || (!data && type !== 'folder')) {
      res.status(400).json({ error: `${!name ? 'Missing name' : !type ? 'Missing type' : 'Missing data'}` }).end();
      return;
    }

    try {
      if (parentId) {
        const folder = await dbClient.filterFiles({ _id: parentId });
        if (!folder || folder.type !== 'folder') {
          res.status(400).json({ error: folder ? 'Parent is not a folder' : 'Parent not found' }).end();
          return;
        }
      }

      const insertedFile = await dbClient.newFile(userId, name, type, isPublic, parentId, data);
      const fileData = insertedFile.ops[0];
      fileData.id = fileData._id;
      delete fileData._id;
      delete fileData.localPath;
      res.status(201).json(fileData).end();
    } catch (err) {
      res.status(400).json({ error: err.message }).end();
    }
  }

  static async fetchFile(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const file = await dbClient.filterFiles({ _id: id });

    if (!file || String(file.userId) !== String(userId)) {
      res.status(404).json({ error: 'Not found' }).end();
    } else {
      res.status(200).json(file).end();
    }
  }

  static async listFiles(req, res) {
    const userId = req.user._id;
    const parentId = req.query.parentId || '0';
    const page = req.query.page || 0;

    const cursor = await dbClient.findFiles(
      { parentId, userId },
      { limit: 20, skip: 20 * page },
    );
    const files = await cursor.toArray();
    files.forEach((file) => {
      file.id = file._id;
      delete file._id;
    });
    res.status(200).json(files).end();
  }

  static async publishFile(req, res) {
    const userId = req.user._id;
    const file = await dbClient.filterFiles({ _id: req.params.id });

    if (!file || String(file.userId) !== String(userId)) {
      res.status(404).json({ error: 'Not found' }).end();
    } else {
      const updatedFile = await dbClient.updatefiles({ _id: file._id }, { isPublic: true });
      res.status(200).json(updatedFile).end();
    }
  }

  static async unpublishFile(req, res) {
    const userId = req.user._id;
    const file = await dbClient.filterFiles({ _id: req.params.id });

    if (!file || String(file.userId) !== String(userId)) {
      res.status(404).json({ error: 'Not found' }).end();
    } else {
      const updatedFile = await dbClient.updatefiles({ _id: file._id }, { isPublic: false });
      res.status(200).json(updatedFile).end();
    }
  }

  static async getFileContent(req, res) {
    const userId = req.user._id;
    const file = await dbClient.filterFiles({ _id: req.params.id });

    if (!file) {
      res.status(404).json({ error: 'Not found' }).end();
    } else if (file.type === 'folder') {
      res.status(400).json({ error: "A folder doesn't have content" }).end();
    } else if (String(file.userId) === String(userId) || file.isPublic) {
      try {
        const content = await Utility.readFile(file.localPath);
        res.set({ 'Content-Type': contentType(file.name) }).status(200).send(content).end();
      } catch {
        res.status(404).json({ error: 'Not found' }).end();
      }
    } else {
      res.status(404).json({ error: 'Not found' }).end();
    }
  }
}

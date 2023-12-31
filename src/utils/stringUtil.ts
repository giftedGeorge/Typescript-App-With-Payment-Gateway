import * as path from 'path';
import * as fs from 'fs';
import logger from '../logger';
import { v4 as uuidv4 } from 'uuid';

export async function getEmailTemplate(templateName:string): Promise<string>{
    return new Promise((resolve, reject) => {
      const rootPath = process.cwd();
      const templatePath = path.join(rootPath, 'src', 'emailTemplates', `${templateName}.html`);
          fs.readFile(templatePath, 'utf8', (err, data) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            logger.info('Template retrieved.')
            resolve(data);
          }
        });
      });
};


export function generateUniqueReference(): string {
  return uuidv4();
};

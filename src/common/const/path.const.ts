import { join } from "path";

export const PROJECT_ROOT_PATH = process.cwd();
export const PUBLIC_FOLDER_NAME = 'public';
export const LOGO_FOLDER_NAME = 'logos';
export const POST_FOLDER_NAME = 'posts';
export const TEMP_FOLDER_NAME = 'temp'

export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);
export const LOGO_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, LOGO_FOLDER_NAME);
export const POST_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, POST_FOLDER_NAME);
export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMP_FOLDER_NAME);
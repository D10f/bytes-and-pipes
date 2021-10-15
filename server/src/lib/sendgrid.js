import { setApiKey } from "@sendgrid/mail";
import config from '../config';

export default () => setApiKey(config.SG_API_KEY);
import 'dotenv/config';
import { createApp } from './shared/app';

const app = createApp();

const port = process.env.PORT ? Number(process.env.PORT) : 52700;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
}); 
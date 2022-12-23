import workerpool from 'workerpool';
import { makeThumbnail } from './services/make-thumbnail.service';

workerpool.worker({
  makeThumbnail,
});

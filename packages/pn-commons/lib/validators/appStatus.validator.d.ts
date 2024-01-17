import { Validator } from '@pagopa-pn/pn-validator';
import { AppStatusDTO, DowntimeDTO, DowntimeLogPageDTO } from '../models';
export declare class BEDowntimeValidator extends Validator<DowntimeDTO> {
    constructor();
}
export declare class AppStatusDTOValidator extends Validator<AppStatusDTO> {
    constructor();
}
export declare class DowntimeLogPageDTOValidator extends Validator<DowntimeLogPageDTO> {
    constructor();
}

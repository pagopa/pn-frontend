import { PFLoginEventsType } from '../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../PFLoginEventStrategyFactory';
import { SendIDPSelectedStrategy } from '../Strategies/SendIDPSelectedStrategy';
import { SendLoginFailureStrategy } from '../Strategies/SendLoginFailureStrategy';
import { SendLoginMethodStrategy } from '../Strategies/SendLoginMethodStrategy';
import { UXScreenViewStrategy } from '../Strategies/UXScreenViewStrategy';

describe('Event Strategy Factory', () => {
  const factory = PFLoginEventStrategyFactory;

  it('should return UXScreenViewStrategy for SEND_LOGIN event', () => {
    expect(factory.getStrategy(PFLoginEventsType.SEND_LOGIN)).toBeInstanceOf(UXScreenViewStrategy);
  });

  it('should return SendIDPSelectedStrategy for SEND_IDP_SELECTED event', () => {
    expect(factory.getStrategy(PFLoginEventsType.SEND_IDP_SELECTED)).toBeInstanceOf(
      SendIDPSelectedStrategy
    );
  });

  it('should return SendLoginFailureStrategy for SEND_LOGIN_FAILURE event', () => {
    expect(factory.getStrategy(PFLoginEventsType.SEND_LOGIN_FAILURE)).toBeInstanceOf(
      SendLoginFailureStrategy
    );
  });

  it('should return SendLoginMethodStrategy for SEND_LOGIN_METHOD event', () => {
    expect(factory.getStrategy(PFLoginEventsType.SEND_LOGIN_METHOD)).toBeInstanceOf(
      SendLoginMethodStrategy
    );
  });

  it('should return null for unknown event type', () => {
    expect(factory.getStrategy('UNKNOWN_EVENT' as PFLoginEventsType)).toBeNull();
  });
});

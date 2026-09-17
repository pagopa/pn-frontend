import { vi } from 'vitest';

import { LegalFactId, LegalFactType } from '../../../../models';
import { fireEvent, render } from '../../../../test-utils';
import NotificationTimelineDescription from '../NotificationTimelineDescription';

describe('NotificationTimelineDescription', () => {
  const firstLegalFact: LegalFactId = {
    key: 'safestorage://first-legal-fact.pdf',
    category: LegalFactType.DIGITAL_DELIVERY,
  };

  const secondLegalFact: LegalFactId = {
    key: 'safestorage://second-legal-fact.pdf',
    category: LegalFactType.PEC_RECEIPT,
  };

  const clickHandler = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a description without inline links when there are no legal facts', () => {
    const { getByText, queryByRole } = render(
      <NotificationTimelineDescription
        description="Descrizione senza documenti."
        legalFactsIds={[]}
        clickHandler={clickHandler}
      />
    );

    expect(getByText('Descrizione senza documenti.')).toBeInTheDocument();
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the legal fact in place of the translation placeholder', () => {
    const { getByText, getByRole } = render(
      <NotificationTimelineDescription
        description="Puoi scaricare l'<0>attestazione</0>."
        legalFactsIds={[firstLegalFact]}
        clickHandler={clickHandler}
      />
    );

    expect(getByText(/Puoi scaricare/)).toBeInTheDocument();
    expect(getByRole('button', { name: 'attestazione' })).toBeInTheDocument();
  });

  it('calls the handler with the corresponding legal fact', () => {
    const { getByRole } = render(
      <NotificationTimelineDescription
        description="Puoi scaricare l'<0>attestazione</0>."
        legalFactsIds={[firstLegalFact]}
        clickHandler={clickHandler}
      />
    );

    fireEvent.click(getByRole('button', { name: 'attestazione' }));

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(firstLegalFact);
  });

  it('maps multiple placeholders to the corresponding legal facts', () => {
    const { getByRole } = render(
      <NotificationTimelineDescription
        description="Scarica la <0>prima attestazione</0> e la <1>seconda attestazione</1>."
        legalFactsIds={[firstLegalFact, secondLegalFact]}
        clickHandler={clickHandler}
      />
    );

    fireEvent.click(getByRole('button', { name: 'prima attestazione' }));
    fireEvent.click(getByRole('button', { name: 'seconda attestazione' }));

    expect(clickHandler).toHaveBeenNthCalledWith(1, firstLegalFact);
    expect(clickHandler).toHaveBeenNthCalledWith(2, secondLegalFact);
  });

  it('does not render unused legal facts when the description has fewer placeholders', () => {
    const { getAllByRole } = render(
      <NotificationTimelineDescription
        description="Scarica la <0>prima attestazione</0>."
        legalFactsIds={[firstLegalFact, secondLegalFact]}
        clickHandler={clickHandler}
      />
    );

    expect(getAllByRole('button')).toHaveLength(1);
  });

  it('ignores placeholders without a corresponding legal fact', () => {
    const { queryByRole } = render(
      <NotificationTimelineDescription
        description="Scarica la <0>prima attestazione</0> e la <1>seconda attestazione</1>."
        legalFactsIds={[firstLegalFact]}
        clickHandler={clickHandler}
      />
    );

    expect(queryByRole('button', { name: 'prima attestazione' })).toBeInTheDocument();
    expect(queryByRole('button', { name: 'seconda attestazione' })).not.toBeInTheDocument();
  });
});

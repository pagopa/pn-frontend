import { vi } from 'vitest';

import { NotificationDetailOtherDocument, NotificationDocumentType } from '../../../models';
import { render, within } from '../../../test-utils';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import NotificationDetailSection from '../NotificationDetailSection';

const aarDocuments: Array<NotificationDetailOtherDocument> = [1, 2].map((index) => ({
  documentId: `AAR_FITTIZIO_00${index}`,
  documentType: NotificationDocumentType.AAR,
  title: `AVVISO_FITTIZIO_00${index}`,
  contentType: 'application/pdf',
  digests: { sha256: `DIGEST_FITTIZIO_00${index}` },
  ref: { key: `AAR_FITTIZIO_00${index}.pdf`, versionToken: 'v1' },
  recipient: {
    denomination: `DESTINATARIO_FITTIZIO_00${index}`,
    taxId: `CODICE_FISCALE_FITTIZIO_00${index}`,
  },
}));

const availableMessage = {
  key: 'detail.download-aar-available',
  ns: 'notifiche',
};

const defaultProps = {
  documents: aarDocuments,
  clickHandler: vi.fn(),
  isCancelled: false,
  aarDocumentAvailable: true,
  downloadFilesMessage: availableMessage,
};

describe('NotificationDetailSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([undefined, []])(
    'does not render documents or availability messages without AAR documents: %j',
    (documents) => {
      const { queryByTestId, queryByText } = render(
        <NotificationDetailSection {...defaultProps} documents={documents} />
      );

      expect(queryByTestId('aarBox')).not.toBeInTheDocument();
      expect(queryByTestId('documentButton')).not.toBeInTheDocument();
      expect(queryByText(`${availableMessage.ns} ${availableMessage.key}`)).not.toBeInTheDocument();
      expect(
        queryByText(`${availableMessage.ns} ${availableMessage.key}-plural`)
      ).not.toBeInTheDocument();
    }
  );

  it('ignores documents that are not AAR documents', () => {
    const { queryByTestId } = render(
      <NotificationDetailSection
        {...defaultProps}
        documents={[
          {
            ...aarDocuments[0],
            documentType: NotificationDocumentType.LEGAL_FACT,
          },
        ]}
      />
    );

    expect(queryByTestId('aarBox')).not.toBeInTheDocument();
    expect(queryByTestId('documentButton')).not.toBeInTheDocument();
  });

  it('shows the singular availability message inside a single AAR box', () => {
    const { getByTestId, queryByText } = render(
      <NotificationDetailSection {...defaultProps} documents={aarDocuments.slice(0, 1)} />
    );

    const box = getByTestId('aarBox');

    expect(box).toHaveTextContent(aarDocuments[0].title!);
    expect(
      within(box).getByText(`${availableMessage.ns} ${availableMessage.key}`)
    ).toBeInTheDocument();
    expect(
      queryByText(`${availableMessage.ns} ${availableMessage.key}-plural`)
    ).not.toBeInTheDocument();
  });

  it('shows one plural availability message outside multiple AAR boxes', () => {
    const { getAllByTestId, getAllByText, queryByText } = render(
      <NotificationDetailSection {...defaultProps} />
    );

    const boxes = getAllByTestId('aarBox');
    const messages = getAllByText(`${availableMessage.ns} ${availableMessage.key}-plural`);

    expect(boxes).toHaveLength(aarDocuments.length);
    expect(messages).toHaveLength(1);
    expect(queryByText(`${availableMessage.ns} ${availableMessage.key}`)).not.toBeInTheDocument();

    boxes.forEach((box, index) => {
      const document = aarDocuments[index];

      expect(box).toHaveTextContent(document.title!);
      expect(box).toHaveTextContent(
        `${document.recipient!.denomination} (${document.recipient!.taxId})`
      );
      expect(box).not.toContainElement(messages[0]);
    });
  });

  it.each([1, 2])('hides %i expired AAR documents and shows the expiration alert', (count) => {
    const expiredMessage = {
      key: 'detail.download-aar-expired',
      ns: 'notifiche',
    };

    const { getByTestId, queryByTestId } = render(
      <NotificationDetailSection
        {...defaultProps}
        documents={aarDocuments.slice(0, count)}
        aarDocumentAvailable={false}
        downloadFilesMessage={expiredMessage}
      />
    );

    expect(getByTestId('aarDisabled')).toHaveTextContent(expiredMessage.key);
    expect(queryByTestId('aarBox')).not.toBeInTheDocument();
    expect(queryByTestId('documentButton')).not.toBeInTheDocument();
  });

  it.each([1, 2])(
    'shows unavailable tags without download buttons for %i cancelled AAR documents',
    (count) => {
      const { getAllByTestId, queryByTestId, queryByText } = render(
        <NotificationDetailSection
          {...defaultProps}
          documents={aarDocuments.slice(0, count)}
          isCancelled
        />
      );

      const boxes = getAllByTestId('aarBox');

      expect(boxes).toHaveLength(count);
      boxes.forEach((box) => {
        expect(box).toHaveTextContent(getLocalizedOrDefaultLabel('common', 'not-available'));
      });

      expect(queryByTestId('documentButton')).not.toBeInTheDocument();
      expect(queryByText(`${availableMessage.ns} ${availableMessage.key}`)).not.toBeInTheDocument();
      expect(
        queryByText(`${availableMessage.ns} ${availableMessage.key}-plural`)
      ).not.toBeInTheDocument();
      expect(defaultProps.clickHandler).not.toHaveBeenCalled();
    }
  );
});

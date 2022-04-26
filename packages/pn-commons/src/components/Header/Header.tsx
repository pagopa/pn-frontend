import {
  HeaderAccount,
  RootLinkType,
  HeaderProduct,
  ProductEntity,
  PartyEntity,
  JwtUser,
} from '@pagopa/mui-italia';
import { Box } from '@mui/material';

type HeaderProps = {
  /** Assistance email for the user */
  assistanceEmail?: string;
  /** List of available products */
  productsList: Array<ProductEntity>;
  /** List of available parties */
  partyList?: Array<PartyEntity>;
  /** Logout/exit action to apply */
  onExitAction?: () => void;
  /** current logged user */
  loggedUser: JwtUser;
};

const pagoPALink: RootLinkType = {
  label: 'PagoPA S.p.A.',
  href: '',
  ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
  title: 'Sito di PagoPA S.p.A.',
};

const Header = ({
  onExitAction = () => window.location.assign(''),
  assistanceEmail,
  productsList,
  partyList,
  loggedUser,
}: HeaderProps) => {

  const handleProductSelection = (product: ProductEntity) => {
    if (product.productUrl) {
      /* eslint-disable-next-line functional/immutable-data */
      window.location.href = product.productUrl;
    }
  };

  return (
    <Box sx={{ zIndex: 1 }}>
      <HeaderAccount
        rootLink={pagoPALink}
        loggedUser={loggedUser}
        onAssistanceClick={() => {
          if (assistanceEmail) {
            /* eslint-disable-next-line functional/immutable-data */
            window.location.href = assistanceEmail;
          }
        }}
        onLogout={onExitAction}
      />
      <HeaderProduct productsList={productsList} partyList={partyList} onSelectedProduct={handleProductSelection}/>
    </Box>
  );
};

export default Header;

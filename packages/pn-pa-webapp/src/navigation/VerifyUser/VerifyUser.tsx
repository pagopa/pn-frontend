const VerifyUser = () => <h1>Welcome to Piattaforma Notifiche</h1>;

// prendo il token da url e pulisco url
// con questo token faccio chiamata alle API che mi restitruirà token nuovo
// salvo il token nello storage e in redux dico login=true
// su redux ho un watch su login e se true navigo su dashboard

export default VerifyUser;

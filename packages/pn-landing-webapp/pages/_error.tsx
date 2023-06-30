import { NextApiResponse } from "next";

import { Typography } from "@mui/material";

export default function Error({ statusCode }: { statusCode: string }) {
  return (
    <Typography variant="body1">
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </Typography>
  );
}

// eslint-disable-next-line functional/immutable-data
Error.getInitialProps = ({
  res,
  err,
}: {
  res: NextApiResponse;
  err: { statusCode: number };
}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

import {NextApiResponse} from 'next';

export default function Error({ statusCode }: {statusCode: string}) {
    return (
        <p>
            {statusCode
                ? `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
        </p>
    );
}

// eslint-disable-next-line functional/immutable-data
Error.getInitialProps = ({ res, err }: {res: NextApiResponse; err: { statusCode: number }}) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};
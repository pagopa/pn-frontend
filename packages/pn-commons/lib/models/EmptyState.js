import { SentimentDissatisfied, InsertEmoticon } from '@mui/icons-material';
// Sentiments that can be applied to EmptyState (will be shown as an icon)
// Could be extended to other suitable components.
export var KnownSentiment;
(function (KnownSentiment) {
    KnownSentiment["DISSATISFIED"] = "SentimentDissatisfied";
    KnownSentiment["SATISFIED"] = "SentimentSatisfied";
    KnownSentiment["NONE"] = "SentimentNone";
})(KnownSentiment || (KnownSentiment = {}));
export function iconForKnownSentiment(sentiment) {
    if (sentiment === KnownSentiment.DISSATISFIED) {
        return SentimentDissatisfied;
    }
    else if (sentiment === KnownSentiment.SATISFIED) {
        return InsertEmoticon;
    }
    else {
        return undefined;
    }
}

/* ------------------------------------------------------------------------
   Types for specific attributes
   ------------------------------------------------------------------------ */
export var DowntimeStatus;
(function (DowntimeStatus) {
    DowntimeStatus["OK"] = "OK";
    DowntimeStatus["KO"] = "KO";
})(DowntimeStatus || (DowntimeStatus = {}));
export var KnownFunctionality;
(function (KnownFunctionality) {
    KnownFunctionality["NotificationCreate"] = "NOTIFICATION_CREATE";
    KnownFunctionality["NotificationVisualization"] = "NOTIFICATION_VISUALIZATION";
    KnownFunctionality["NotificationWorkflow"] = "NOTIFICATION_WORKFLOW";
})(KnownFunctionality || (KnownFunctionality = {}));
export function isKnownFunctionality(functionality) {
    return Object.values(KnownFunctionality).includes(functionality);
}

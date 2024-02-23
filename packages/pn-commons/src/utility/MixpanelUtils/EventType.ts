/**
 * List of events to track.
 * This is a class containing events common for all applications.
 * It can be extended by every single app to add its own events.
 * @date 23/2/2024 - 17:04:29
 *
 * @export
 * @class EventType
 * @typedef {EventType}
 */
export default abstract class EventType {
  static readonly PAGE_VIEW = 'pageView';
  static readonly BUTTON_CLICK = 'buttonClick';
}

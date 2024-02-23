/**
 * Description placeholder
 * @date 23/2/2024 - 17:40:31
 *
 * @export
 * @abstract
 * @class EventStrategy
 * @typedef {EventStrategy}
 */
export default abstract class EventStrategy {
  // questa funzione si occupera di ricevere in ingresso i dati
  // dell'evento e di fare le necessarie trasformazioni
  abstract performComputations(data: unknown): { ReturnType };
}

import PouchDB from 'pouchdb';
const cuentasdb = new PouchDB('cuentasdb');
const catalogodb = new PouchDB('catalogodb');
export { cuentasdb, catalogodb };//Exportamos las bases
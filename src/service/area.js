import { db } from './firebase.js'
import { getDocs, limit, addDoc, collection, onSnapshot, serverTimestamp, query, orderBy, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const userRef = collection(db, 'usuarios');

export async function createArea(uid, data) {
    const thisUserRef = doc(userRef, uid);
    const areaRef = collection(thisUserRef, 'areas');
    return addDoc(areaRef, { ...data, creado: serverTimestamp() });
}

export async function UpdateArea(idUser, idArea, data) {
    const userDocRef = doc(userRef, idUser);
    const areaDocRef = doc(userDocRef, 'areas', idArea);
    const areaSnapshot = await getDoc(areaDocRef);
    if (areaSnapshot.exists()) {
        return await updateDoc(areaDocRef, {
            poligons: data.poligons,
            areaKilometros: data.areaKilometers,
            creado: serverTimestamp(),
        });
        return null;
    }
}

export async function addNewDataArea(idUser, idArea, data) {
    const userDocRef = doc(userRef, idUser);
    const areaDocRef = doc(userDocRef, 'areas', idArea);
    const areaSnapshot = await getDoc(areaDocRef);
    if (areaSnapshot.exists()) {
        return await updateDoc(areaDocRef, {
            nombreCosecha: data.name,
            pesoPorCosecha: data.weightPerHarvest,
            valorPorTonelada: data.valuePerTon,
            colorArea: data.areaColor,
            diaPlantacion: data.plantationDate,
            diaCosecha: data.harvestDate
        });
        return null;
    }
}

export async function lastAreaById(id) {
    if (id) {
        const thisUserRef = collection(userRef, id, 'areas')
        const q = query(
            thisUserRef,
            orderBy("creado", "desc"),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const lastAreaDoc = querySnapshot.docs[0];
            const lastAreaData = { id: lastAreaDoc.id, ...lastAreaDoc.data() };
            return lastAreaData;
        }
    }
    return null;
}

export function findUserAreas(userId, callback) {
    const usuarioRef = collection(db, 'usuarios', userId, 'areas');
    const q = query(usuarioRef, orderBy('creado', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                name: doc.data().nombreCosecha,
                weightPerHarvest: doc.data().pesoPorCosecha,
                valuePerTon: doc.data().valorPorTonelada,
                poligons: doc.data().poligons,
                areaKilometers: doc.data().areaKilometros,
                created: doc.data().creado,
                areaColor: doc.data().colorArea,
                plantationDate: doc.data().diaPlantacion,
                harvestDate: doc.data().diaCosecha
            };
        });
        callback(data);
    });
}

export function findAreaById(userId, areaId, callback) {
    const userRef = doc(db, 'usuarios', userId);
    const areaRef = doc(userRef, 'areas', areaId);
    getDoc(areaRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            const areaData = docSnapshot.data();
            callback({
                id: docSnapshot.id,
                name: areaData.nombreCosecha,
                weightPerHarvest: areaData.pesoPorCosecha,
                valuePerTon: areaData.valorPorTonelada,
                poligons: areaData.poligons,
                areaKilometers: areaData.areaKilometros,
                created: areaData.creado,
                areaColor: areaData.colorArea,
                plantationDate: areaData.diaPlantacion,
                harvestDate: areaData.diaCosecha
            });
        } else {
            callback(null);
        }
    });
}

export async function deleteArea(userId, areaId) {
    const userRef = doc(db, 'usuarios', userId);
    const areaRef = doc(userRef, 'areas', areaId);
    try {
        return await deleteDoc(areaRef);
    } catch (error) {
        console.error('Error al eliminar el área:', error);
        return null;
    }
}
import mssqlConnection from '../db/mssql.connect';
import { MethodEntity } from '../entity/method.entity';
import { Method } from '../models/method.model';

export const methodRepository = mssqlConnection.getRepository(MethodEntity);

const findMethodByCode = async (method: string) => {
    return await methodRepository.find({
        select: {
            METHOD_CODE: true
        },
        where: {
            METHOD_CODE: method
        }
    })
}

const getMethodCode = async () => {
    return await methodRepository.find({
        order: {
            UPDATE_DATE: 'DESC'
        }
    })
}

const deleteMethod = async (methodList: Method[]) => {
    return await methodRepository.delete(methodList.map(e => e.METHOD_CODE));
}

const createMethod = async (insertList: Method[]) => {
    return await methodRepository.save(insertList);
}

const updateMethod = async (updateList: Method[]) => {
    for (const data of updateList) {
        await methodRepository.update({ METHOD_CODE: data.METHOD_CODE }, data);
    }
    return true;
}
export { findMethodByCode, getMethodCode, deleteMethod, createMethod, updateMethod };

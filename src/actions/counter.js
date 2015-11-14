import { COUNTER_INCREMENT } from 'constants/counter';

export default {
    increment() {
        return { type : COUNTER_INCREMENT }
    }
};

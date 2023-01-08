import { validatePassword } from '@lib/password';
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

const expect = chai.expect

describe('validatePassword', () => {
    it('should return true for password w/ entropy >80', () => {
        const pswd1 = validatePassword('@m1I$B1F@r-a-n0T-h3r-P@ssw0rd')
        const pswd2 = validatePassword('correct horse battery staple')
        
        expect(pswd1.result).to.equal(true);
        expect(pswd1.entropy).to.be.above(80);

        expect(pswd2.result).to.equal(true);
        expect(pswd2.entropy).to.be.above(80);
    });

    it('should return false for password w/ entropy <80', () => {
        expect(validatePassword('password').result)
            .to.equal(false);
        expect(validatePassword('123456').result)
            .to.equal(false);
    });
});
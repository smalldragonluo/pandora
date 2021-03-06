import {HealthEndPoint} from '../../../src/endpoint/impl/HealthEndPoint';
import {DiskSpaceHealthIndicator} from '../../../src/indicator/impl/health/DiskSpaceHealthIndicator';
import {expect} from 'chai';
import {PortHealthIndicator} from '../../../src/indicator/impl/health/PortHealthIndicator';

describe('/test/unit/endpoint/HealthEndpoint.test.ts', () => {

  it('invoke health endpoint', async () => {
    let endpoint = new HealthEndPoint();
    endpoint.setConfig({
      enabled: true,
      target: HealthEndPoint,
      initConfig: {
        port: {
          enabled: true,
          checkUrl: `http://127.1:6001/check.node`
        },
        disk_space: {
          enabled: true,
          rate: 80,
        }
      }
    });
    endpoint.initialize();

    let healthIndicator = new DiskSpaceHealthIndicator();
    healthIndicator.initialize();
    let portHealthIndicator = new PortHealthIndicator();
    portHealthIndicator.initialize();


    let results = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(endpoint.invoke());
      }, 200);
    });
    expect(results[0].key).to.be.equal('disk_space');
    expect(results[1].key).to.be.equal('port');
  });

});

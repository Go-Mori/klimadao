import { ethers, providers } from "ethers";
import { Thunk } from "state";

import IERC20 from "@klimadao/lib/abi/IERC20.json";
import wsKlima from "@klimadao/lib/abi/wsKlima.json";

import { addresses } from "@klimadao/lib/constants";
import { formatUnits, trimStringDecimals } from "@klimadao/lib/utils";
import {
  setBalance,
  setExerciseAllowance,
  setMigrateAllowance,
  setStakeAllowance,
  setWrapAllowance,
} from "state/user";

export const loadAccountDetails = (params: {
  provider: providers.JsonRpcProvider;
  address: string;
  onRPCError: () => void;
}): Thunk => {
  return async (dispatch) => {
    try {
      const bctContract = new ethers.Contract(
        addresses["mainnet"].bct,
        IERC20.abi,
        params.provider
      );
      const nctContract = new ethers.Contract(
        addresses["mainnet"].nct,
        IERC20.abi,
        params.provider
      );
      const mco2Contract = new ethers.Contract(
        addresses["mainnet"].mco2,
        IERC20.abi,
        params.provider
      );
      const uboContract = new ethers.Contract(
        addresses["mainnet"].ubo,
        IERC20.abi,
        params.provider
      );
      const nboContract = new ethers.Contract(
        addresses["mainnet"].nbo,
        IERC20.abi,
        params.provider
      );
      const usdcContract = new ethers.Contract(
        addresses["mainnet"].usdc,
        IERC20.abi,
        params.provider
      );
      const klimaContract = new ethers.Contract(
        addresses["mainnet"].klima,
        IERC20.abi,
        params.provider
      );
      const sklimaContract = new ethers.Contract(
        addresses["mainnet"].sklima,
        IERC20.abi,
        params.provider
      );
      const wsklimaContract = new ethers.Contract(
        addresses["mainnet"].wsklima,
        wsKlima.abi,
        params.provider
      );
      const aklimaContract = new ethers.Contract(
        addresses["mainnet"].aklima,
        IERC20.abi,
        params.provider
      );
      const alklimaContract = new ethers.Contract(
        addresses["mainnet"].alklima,
        IERC20.abi,
        params.provider
      );
      const pKlimaContract = new ethers.Contract(
        addresses["mainnet"].pklima,
        IERC20.abi,
        params.provider
      );

      // balances
      const balances = [
        // CARBON
        bctContract.balanceOf(params.address),
        mco2Contract.balanceOf(params.address),
        nctContract.balanceOf(params.address),
        uboContract.balanceOf(params.address),
        nboContract.balanceOf(params.address),

        // KLIMA
        klimaContract.balanceOf(params.address),
        sklimaContract.balanceOf(params.address),
        wsklimaContract.balanceOf(params.address),
        aklimaContract.balanceOf(params.address),
        alklimaContract.balanceOf(params.address),
        pKlimaContract.balanceOf(params.address),
        // USDC
        usdcContract.balanceOf(params.address),

        // allowances token.allowance(owner, spender)
        klimaContract.allowance(
          params.address,
          addresses["mainnet"].staking_helper
        ),
        sklimaContract.allowance(params.address, addresses["mainnet"].staking),
        sklimaContract.allowance(params.address, addresses["mainnet"].wsklima),
        aklimaContract.allowance(
          params.address,
          addresses["mainnet"].aklima_migrate
        ),
        alklimaContract.allowance(
          params.address,
          addresses["mainnet"].alklima_migrate
        ),
        pKlimaContract.allowance(
          params.address,
          addresses["mainnet"].pklima_exercise
        ),
        bctContract.allowance(
          params.address,
          addresses["mainnet"].pklima_exercise
        ),
      ];

      const [
        bctBalance,
        mco2Balance,
        nctBalance,
        uboBalance,
        nboBalance,
        klimaBalance,
        sklimaBalance,
        wsklimaBalance,
        aklimaBalance,
        alklimaBalance,
        pklimaBalance,
        usdcBalance,
        stakeAllowance,
        unstakeAllowance,
        wrapAllowance,
        aKlimaAllowance,
        alKlimaAllowance,
        pKlimaAllowance,
        bctAllowance,
      ] = await Promise.all(balances);

      dispatch(
        setBalance({
          klima: formatUnits(klimaBalance, 9),
          sklima: formatUnits(sklimaBalance, 9),
          wsklima: trimStringDecimals(formatUnits(wsklimaBalance), 9), // trim to 9 for compat with sKLIMA contract
          aklima: formatUnits(aklimaBalance),
          pklima: formatUnits(pklimaBalance),
          alklima: formatUnits(alklimaBalance),
          bct: formatUnits(bctBalance),
          nct: formatUnits(nctBalance),
          mco2: formatUnits(mco2Balance),
          ubo: formatUnits(uboBalance),
          nbo: formatUnits(nboBalance),
          usdc: formatUnits(usdcBalance, 6),
        })
      );
      dispatch(
        setMigrateAllowance({
          aklima: formatUnits(aKlimaAllowance),
          alklima: formatUnits(alKlimaAllowance),
        })
      );
      dispatch(
        setStakeAllowance({
          klima: formatUnits(stakeAllowance, 9),
          sklima: formatUnits(unstakeAllowance, 9),
        })
      );
      dispatch(
        setExerciseAllowance({
          bct: formatUnits(bctAllowance),
          pklima: formatUnits(pKlimaAllowance),
        })
      );
      dispatch(
        setWrapAllowance({
          sklima: formatUnits(wrapAllowance),
          // wsklima: formatUnits(wsklimaWrapAllowance),
        })
      );
    } catch (error: any) {
      if (error.message && error.message.includes("Non-200 status code")) {
        params.onRPCError();
      }
    }
  };
};

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
} from "react-native";
import CommonStyle from "../common/common_style";
import ExitBtn from "../simul_common/exit_btn";
import SimulMainStyle from "./simul_main_style";
import Axios from "axios";
import baseURL from "../baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SimulMain = ({ navigation }: any) => {
  const [type, setType] = useState<string>("");
  const [num, setNum] = useState<number>();
  const [red, setRed] = useState<string[]>();

  useEffect(() => {
    fetchSimulMain();
  }, []);

  const fetchSimulMain = async () => {
    try {
      const token = await AsyncStorage.getItem('user_Token')
      Axios.get(baseURL + "/simulation", {
        headers: {
          accessToken: `${token}`,
        },
      }).then((res) => {
        setTimeout(() => setType(res.data.type), 2000);
        setNum(res.data.num);
        setRed(res.data.red);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(type, num, red);
  }, [red]);

  const isInRed = (appType: string) => {
    if (red?.includes(appType)) return true;
  };

  return (
    <SafeAreaView style={CommonStyle.container}>
      <Image
        source={require("../../assets/icons/simul_main/galaxy.png")}
        style={SimulMainStyle.img_galaxy}
      />
      {/* 스마트폰 */}
      <View style={SimulMainStyle.phone_div}>
        {/* 앱 푸시 바 */}
        <View style={SimulMainStyle.phone_push_div}>
          {type === "sns" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("MessageSimul")}
            >
              <Image
                source={require("../../assets/icons/simul_main/sns_push.png")}
                style={SimulMainStyle.img_push}
              />
            </TouchableOpacity>
          )}
          {type === "message" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("MessageSimul")}
            >
              <Image
                source={require("../../assets/icons/simul_main/message_push.png")}
                style={SimulMainStyle.img_push}
              />
            </TouchableOpacity>
          )}
          {type === "call" && (
            <TouchableOpacity>
              <Image
                source={require("../../assets/icons/simul_main/call_push.png")}
                style={SimulMainStyle.img_push}
              />
            </TouchableOpacity>
          )}
        </View>

        {/*  앱 바탕 */}
        <View style={SimulMainStyle.phone_app_div}>
          <>
            <Image
              source={require("../../assets/icons/simul_main/ic_app1.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app2.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app3.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app4.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app5.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app6.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app7.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app8.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app9.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app10.png")}
              style={SimulMainStyle.img_app_icon}
            />
            <Image
              source={require("../../assets/icons/simul_main/ic_app11.png")}
              style={SimulMainStyle.img_app_icon}
            />
          </>

          {/*  SNS */}
          <TouchableOpacity onPress={() => navigation.navigate("MessageSimul")}>
            {type === "sns" || isInRed("sns") ? (
              <Image
                source={require(`../../assets/icons/simul_main/sns_red.png`)}
                style={SimulMainStyle.img_app_icon}
              />
            ) : (
              <Image
                source={require(`../../assets/icons/simul_main/sns_default.png`)}
                style={SimulMainStyle.img_app_icon}
              />
            )}
          </TouchableOpacity>
        </View>

        {/*  앱 하단바 */}
        <View style={SimulMainStyle.phone_bottom_div}>
          {/*  MSG */}
          <TouchableOpacity onPress={() => navigation.navigate("MessageSimul")}>
            {type === "message" || isInRed("message") ? (
              <Image
                source={require(`../../assets/icons/simul_main/message_red.png`)}
                style={SimulMainStyle.img_bottom_app_icon}
              />
            ) : (
              <Image
                source={require("../../assets/icons/simul_main/message_default.png")}
                style={SimulMainStyle.img_bottom_app_icon}
              />
            )}
          </TouchableOpacity>

          {/*  앱 서랍장 */}
          <TouchableOpacity>
            <Image
              source={require("../../assets/icons/simul_main/app_container.png")}
              style={SimulMainStyle.img_bottom_app_icon}
            />
          </TouchableOpacity>

          {/*  CALL */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("VoiceSimulMain");
            }}
          >
            {type === "call" || isInRed("call") ? (
              <Image
                source={require(`../../assets/icons/simul_main/call_red.png`)}
                style={SimulMainStyle.img_bottom_app_icon}
              />
            ) : (
              <Image
                source={require("../../assets/icons/simul_main/call_default.png")}
                style={SimulMainStyle.img_bottom_app_icon}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 이동버튼 */}
      <View style={CommonStyle.container_exit}>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <View>
            <Text style={CommonStyle.exit_btn_text}>체험 나가기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SimulMain;

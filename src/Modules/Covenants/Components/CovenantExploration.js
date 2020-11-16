import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { soulbindDB } from "../SoulbindDB";
import SoulbindNode from "./SoulbindNode";
import ConduitObject from "./ConduitObject";
import Grid from "@material-ui/core/Grid";
import { getSoulbindFormula } from "../../Engine/EffectFormulas/Generic/GenericSoulbindFormulas";
import SoulbindStatPanel from "./SoulbindStatPanel";
import { sumSelectedStats, getEstimatedHPS, getConduitIcon, buildConduitStats } from "../CovenantUtilities";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function a11yPropsVert(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "2%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    maxWidth: 1010,
  },
  panel: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 700, // 609
    backgroundColor: "#191c23",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

// ==============================================
export default function SimpleTabs(props) {
  const classes = useStyles();
  const [tabvalue, setTabValue] = React.useState(0);
  const [soulbindValue, setSoulbindValue] = React.useState(0);
  const [soulbindState, setSoulbindState] = React.useState(
    buildBonusStats(soulbindDB, props.pl, props.contentType)
  );

  function buildBonusStats(soulbindTraits, player, contentType) {
    let updatedArray = soulbindTraits.map((trait) => {
      console.log("PL: " + player + ". CT: " + contentType);
      return {
        ...trait,
        bonus_stats: getSoulbindFormula(
          trait.id,
          player,
          contentType
        ),
      };
    });
    return updatedArray;
    //setSoulbindState(updatedArray);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSoulbindValue(0);
  };

  const handleChange2 = (event, newValue) => {
    setSoulbindValue(newValue);
  };

  function activateSoulbind(id) {
    let updatedArray = soulbindState.map((trait) => {
      if (trait.id === id) {
        return { ...trait, active: !trait.active };
      }
      return trait;
    });

    setSoulbindState(updatedArray);
  }

  function setConduitInSlot(slotID, conduitID) {
    let updatedArray = soulbindState.map((trait) => {
      if (trait.id === slotID) {
        return { ...trait, slotted_id: conduitID, icon: getConduitIcon(conduitID), active: true};
      }
      return trait;
    });

    
    setSoulbindState(updatedArray);
  }

  //console.log(">>>" + JSON.stringify(soulbindState));

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={tabvalue}
          onChange={handleTabChange}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="Kyrian" {...a11yProps(0)} />
          <Tab label="Night Fae" {...a11yProps(1)} />
          <Tab label="Venthyr" {...a11yProps(2)} />
          <Tab label="Necrolords" {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      {/* Kyrian */}
      <TabPanel value={tabvalue} index={0}>
        <div className={classes.panel}>
          <Tabs
            orientation="vertical"
            value={soulbindValue}
            onChange={handleChange2}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL + "/Images/Interface/pelagos.webp"
                  }
                />
              }
              label="Pelagos"
              {...a11yPropsVert(0)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={process.env.PUBLIC_URL + "/Images/Interface/kleia.webp"}
                />
              }
              label="Kleia"
              {...a11yPropsVert(1)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/forgelite-prime-mikanikos.webp"
                  }
                />
              }
              label="Mikanikos"
              {...a11yPropsVert(2)}
            />
          </Tabs>

          {/* // need to figure out how to pass "pelagos" as the index or a value as a "soulbind1 prop" otherwise each 1st soulbind will show the pelagos tree */}
          <TabPanel
            value={soulbindValue}
            index={0}
            style={{ display: "inline-flex" }}
          >
            {buildSoulbind(
              "Pelagos",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel
            value={soulbindValue}
            index={1}
            style={{ display: "inline-flex" }}
          >
            {buildSoulbind(
              "Kleia",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel
            value={soulbindValue}
            index={2}
            style={{ display: "inline-flex" }}
          >
            {buildSoulbind(
              "Mikanikos",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
        </div>
      </TabPanel>

      {/* Night Fae */}
      <TabPanel value={tabvalue} index={1}>
        <div className={classes.panel}>
          <Tabs
            orientation="vertical"
            // variant="scrollable"
            value={soulbindValue}
            onChange={handleChange2}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={process.env.PUBLIC_URL + "/Images/Interface/niya.webp"}
                />
              }
              label="Niya"
              {...a11yPropsVert(0)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/dreamweaver.webp"
                  }
                />
              }
              label="Dreamweaver"
              {...a11yPropsVert(1)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={process.env.PUBLIC_URL + "/Images/Interface/korayn.webp"}
                />
              }
              label="Korayn"
              {...a11yPropsVert(2)}
            />
          </Tabs>

          {/* // need to figure out how to pass "pelagos" as the index or a value as a "soulbind1 prop" otherwise each 1st soulbind will show the pelagos tree */}
          <TabPanel value={soulbindValue} index={0}>
            {buildSoulbind(
              "Niya",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel value={soulbindValue} index={1}>
            {buildSoulbind(
              "Dreamweaver",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel value={soulbindValue} index={2}>
            {buildSoulbind(
              "Korayn",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
        </div>
      </TabPanel>

      {/* Venthyr */}
      <TabPanel value={tabvalue} index={2}>
        <div className={classes.panel}>
          <Tabs
            orientation="vertical"
            // variant="scrollable"
            value={soulbindValue}
            onChange={handleChange2}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/nadjia-the-mistblade.webp"
                  }
                />
              }
              label="Nadjia"
              {...a11yPropsVert(0)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/theotar-the-mad-duke.webp"
                  }
                />
              }
              label="Theotar"
              {...a11yPropsVert(1)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/general-draven.webp"
                  }
                />
              }
              label="Draven"
              {...a11yPropsVert(2)}
            />
          </Tabs>

          {/* // need to figure out how to pass "pelagos" as the index or a value as a "soulbind1 prop" otherwise each 1st soulbind will show the pelagos tree */}
          <TabPanel value={soulbindValue} index={0}>
            {buildSoulbind(
              "Nadjia",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel value={soulbindValue} index={1}>
            {buildSoulbind(
              "Theotar",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel value={soulbindValue} index={2}>
            {buildSoulbind(
              "Draven",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
        </div>
      </TabPanel>

      {/* Necrolords */}
      <TabPanel value={tabvalue} index={3}>
        <div className={classes.panel}>
          <Tabs
            orientation="vertical"
            // variant="scrollable"
            value={soulbindValue}
            onChange={handleChange2}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/plague-deviser-marileth.webp"
                  }
                />
              }
              label="Marileth"
              {...a11yPropsVert(0)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={process.env.PUBLIC_URL + "/Images/Interface/emeni.webp"}
                />
              }
              label="Emeni"
              {...a11yPropsVert(1)}
            />
            <Tab
              style={{ color: "white" }}
              icon={
                <img
                  height={100}
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/bonesmith-heirmir.webp"
                  }
                />
              }
              label="Heirmir"
              {...a11yPropsVert(2)}
            />
          </Tabs>

          {/* // need to figure out how to pass "pelagos" as the index or a value as a "soulbind1 prop" otherwise each 1st soulbind will show the pelagos tree */}
          <TabPanel value={soulbindValue} index={0}>
            {buildSoulbind(
              "Marileth",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel value={soulbindValue} index={1}>
            {buildSoulbind(
              "Emeni",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
          <TabPanel value={soulbindValue} index={2}>
            {buildSoulbind(
              "Heirmir",
              props.pl,
              props.contentType,
              soulbindState,
              activateSoulbind,
              setConduitInSlot,
            )}
          </TabPanel>
        </div>
      </TabPanel>
    </div>
  );
}

/* 


*/
function buildSoulbind(
  soulbindName,
  player,
  contentType,
  soulbindState,
  activateSoulbind,
  setConduitInSlot,
) {
  //console.log(JSON.stringify(soulbindState));
  //console.log("Post: " + JSON.stringify(soulbindState))
  //let activeSoulbind = soulbindState[soulbindName];
  let activeSoulbind = soulbindState.filter(
    (trait) => trait.soulbind === soulbindName
  );

  player.calculateConduits(contentType);
  

  let potencyConduits = player.getActiveConduits("Potency");
  let enduranceConduits = player.getActiveConduits("Endurance");


  soulbindState = buildConduitStats(soulbindState, player, contentType);

  let statSums = sumSelectedStats(soulbindName, soulbindState);
  let estimatedHPS = getEstimatedHPS(statSums, player, contentType);
  //let conduitList = ["Conduit 1", "Conduit 2", "Conduit 3", "Conduit 4", "Conduit 5"] // Pure, raw placeholder.

  //console.log("Y" + soulbindName);
  //console.log(activeSoulbind);

  return (
    <Grid
      id="soulbind"
      container
      direction="row"
      style={{ display: "flex", flexWrap: "nowrap" }}
    >
      <Grid item>
        <div id="soulbinds" style={{ position: "relative" }}>
          <img
            src={
              process.env.PUBLIC_URL +
              "/Images/Interface/SoulbindBackgroundFat.jpg"
            }
          />
          <div id="nodes" style={{}}>
            {activeSoulbind.map((trait, index) => (
              <SoulbindNode
                key={index}
                activateSoulbind={activateSoulbind}
                setConduitInSlot={setConduitInSlot}
                soulbindTrait={trait}
                player={player}
                contentType={contentType}
                potencyConduits={potencyConduits}
                enduranceConduits={enduranceConduits}
              />
            ))}
          </div>
        </div>
      </Grid>

      <Grid container>
        <div
          id="conduits"
          style={{
            position: "relative",
            width: 245,
            backgroundColor: "#191c23",
            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
            maxHeight: 700, // 609 Slim
          }}
        >
          {/* <img
            src={
              process.env.PUBLIC_URL + "/Images/Interface/ConduitContainer.jpg"
            }
          /> */}

          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            style={{ height: "100%" }}
          >
            <Grid
              container
              id="conduitChoices"
              spacing={1}
              style={{
                margin: 1,
              }}
            >
              <Grid item xs={12}>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/PotencyConduitTag.png"
                  }
                  style={{
                    objectFit: "cover",
                    width: "214px",
                    paddingLeft: "8px",
                  }}
                />
                <Grid container spacing={1} style={{ maxWidth: 245 }} xs={12}>
                  {potencyConduits.map((conduit, index) => (
                    <ConduitObject conduit={conduit} />
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/Interface/EnduranceConduitTag.png"
                  }
                  style={{
                    objectFit: "cover",
                    width: "214px",
                    paddingLeft: "8px",
                  }}
                />
                <Grid container spacing={1} style={{ maxWidth: 245 }} xs={12}>
                  {enduranceConduits.map((conduit, index) => (
                    <ConduitObject conduit={conduit} />
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} style={{ paddingBottom: 4 }}>
                <SoulbindStatPanel hps={estimatedHPS} stats={statSums} />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}
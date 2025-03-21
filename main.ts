// Declare exposed API
declare function GetHashKey(name: string): Hash;
declare function CreateVehicleServerSetter(modelHash: Hash, modelType: string, x: number, y: number, z: number, heading: number): void
declare function CreateThread(callback: () => void): void;
declare function Wait(ms: number): void;
declare function AddEventHandler(name: string, callback: (...args: any[]) => void): void;
declare function CancelEvent(): void;
declare function GetCurrentResourceName(): string;
declare function GetPlayerName(source: number): string

type Hash = number;
type Vector3 = [number, number, number];

enum ModelTypes
{
    Automobile = "automobile",
    Bike = "bike",
    Boat = "boat",
    Heli = "heli",
    Plane = "plane",
    Submarine = "submarine",
    Trailer = "trailer",
    Train = "train"
}

enum ClientDropReason
{
    // resource dropped the client
	RESOURCE = 1,
	// client initiated a disconnect
	CLIENT,
	// server initiated a disconnect
	SERVER,
	// client with same guid connected and kicks old client
	CLIENT_REPLACED,
	// server -> client connection timed out
	CLIENT_CONNECTION_TIMED_OUT,
	// server -> client connection timed out with pending commands
	CLIENT_CONNECTION_TIMED_OUT_WITH_PENDING_COMMANDS,
	// server shutdown triggered the client drop
	SERVER_SHUTDOWN,
	// state bag rate limit exceeded
	STATE_BAG_RATE_LIMIT,
	// net event rate limit exceeded
	NET_EVENT_RATE_LIMIT,
	// latent net event rate limit exceeded
	LATENT_NET_EVENT_RATE_LIMIT,
	// command rate limit exceeded
	COMMAND_RATE_LIMIT,
	// too many missed frames in OneSync
	ONE_SYNC_TOO_MANY_MISSED_FRAMES
}

// Using it
// Writing internal API
class Cfx {
    static onResourceStart(callback: (resourceName: string) => void)
    {
        AddEventHandler("onResourceStart", callback)
    }

    static onResourceStop(callback: (resourceName: string) => void)
    {
        AddEventHandler("onResourceStop", callback)
    }

    static playerConnecting(callback: (playerName: string, setKickReason: (reason: string) => void, deferrals: { defer: any; done: (text:string) => void; handover: any; presentCard: any; update: (text:string) => void }, source: string) => void): void
    {
        AddEventHandler("playerConnecting", callback)
    }

    static playerDropped(callback: (reason: string, resourceName: string, clientDropReason: ClientDropReason) => void)
    {
        AddEventHandler("playerDropped", callback)
    }
}

class World {
    static CreateVehicle(modelName: string, modelType: ModelTypes, position: Vector3, heading: number)
    {
        CreateVehicleServerSetter(GetHashKey(modelName), modelType, ...position, heading)
    }
}

const names: string[] = [
    "rhino",
    "zentorno"
]
const defaultSpawn: Vector3 = [
    98.9571,
    -223.855743,
    55.0013733
]

CreateThread(() => {
    while (true){
        print(_VERSION);
        Wait(1000)
    }
})

names.forEach((car) => {
    World.CreateVehicle(car, ModelTypes.Automobile, defaultSpawn, 0)
    print(`Created Vehicle: ${car}`)
})

Cfx.onResourceStart((name) => {
    print(`Starting Ressource: ${name}`)

    print(`Currently ExecutionResource is ${GetCurrentResourceName()}`)
})

Cfx.onResourceStop((name) => {
    print(`Stopping Ressource: ${name}`)
})

Cfx.playerConnecting((name, setKickReason, deferrals, source) => {
    deferrals.update(`Hello ${name}. Your steam ID is being checked.`)
    deferrals.done("");
})

Cfx.playerDropped((reason, resourceName, clientDropReason) => {
    print(`Player ${GetPlayerName(source)} dropped (Reason: ${reason}, Resource: ${resourceName}, Client Drop Reason: ${clientDropReason}).`)
})
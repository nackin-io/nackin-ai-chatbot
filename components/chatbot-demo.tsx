"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  Clock3,
  LifeBuoy,
  Menu,
  MessageCircle,
  PackageSearch,
  Palette,
  RefreshCcw,
  SendHorizontal,
  Settings2,
  ShoppingBag,
  SmilePlus,
  Sparkles,
  TrendingUp,
  User,
  WalletCards,
  X,
  Wrench,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FlowKey = "product" | "order" | "refund" | "technical";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  category: FlowKey | null;
  messages: Message[];
};

type BotSettings = {
  botName: string;
  botAvatar: string;
  welcomeMessage: string;
  brandColor: string;
};

type FlowDefinition = {
  key: FlowKey;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  starter: string;
  hints: string[];
};

const COLOR_PRESETS = [
  "#4f46e5",
  "#2563eb",
  "#0ea5e9",
  "#0284c7",
  "#4338ca",
  "#1d4ed8",
];

const FLOW_DEFINITIONS: FlowDefinition[] = [
  {
    key: "product",
    label: "Product Questions",
    icon: ShoppingBag,
    starter: "Can you explain the differences between your plans?",
    hints: ["plans", "pricing", "features", "compare"],
  },
  {
    key: "order",
    label: "Order Status",
    icon: PackageSearch,
    starter: "I need an update on order #204981.",
    hints: ["order", "shipping", "tracking", "delivery"],
  },
  {
    key: "refund",
    label: "Refunds",
    icon: RefreshCcw,
    starter: "How can I request a refund for my recent purchase?",
    hints: ["refund", "return", "cancel", "money back"],
  },
  {
    key: "technical",
    label: "Technical Support",
    icon: Wrench,
    starter: "The dashboard keeps showing an authentication error.",
    hints: ["error", "issue", "login", "bug", "technical"],
  },
];

const METRIC_CARDS = [
  {
    label: "Conversations Today",
    value: "124",
    delta: "+12.5%",
    icon: MessageCircle,
  },
  {
    label: "Avg Response Time",
    value: "1.7s",
    delta: "-0.3s",
    icon: Clock3,
  },
  {
    label: "Satisfaction Score",
    value: "94%",
    delta: "+2.8%",
    icon: SmilePlus,
  },
  {
    label: "Resolution Rate",
    value: "88%",
    delta: "+4.1%",
    icon: CheckCircle2,
  },
];

const CONVERSATIONS_BY_HOUR = [
  { hour: "8 AM", conversations: 10 },
  { hour: "10 AM", conversations: 18 },
  { hour: "12 PM", conversations: 24 },
  { hour: "2 PM", conversations: 19 },
  { hour: "4 PM", conversations: 22 },
  { hour: "6 PM", conversations: 15 },
];

const SATISFACTION_TREND = [
  { day: "Mon", score: 90 },
  { day: "Tue", score: 91 },
  { day: "Wed", score: 92 },
  { day: "Thu", score: 94 },
  { day: "Fri", score: 95 },
  { day: "Sat", score: 94 },
  { day: "Sun", score: 93 },
];

const RESOLUTION_SPLIT = [
  { name: "Resolved", value: 68, color: "#4f46e5" },
  { name: "Escalated", value: 18, color: "#0ea5e9" },
  { name: "Pending", value: 14, color: "#cbd5e1" },
];

const DEFAULT_SETTINGS: BotSettings = {
  botName: "Nackin Assistant",
  botAvatar: "N",
  welcomeMessage:
    "Hi! I can help with product details, order updates, refunds, and technical troubleshooting.",
  brandColor: "#0d9488",
};

const EMBED_SNIPPET =
  '<script src="https://cdn.nackin.io/widget.js" data-bot-id="YOUR_BOT_ID" data-color="#0d9488" data-position="bottom-right"></script>';

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function nowMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function relativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  return `${Math.floor(diff / hour)}h ago`;
}

function inferFlow(input: string, selectedFlow: FlowKey | null): FlowKey {
  if (selectedFlow) return selectedFlow;
  const normalized = input.toLowerCase();
  if (/(refund|return|chargeback|money back|cancel)/.test(normalized)) {
    return "refund";
  }
  if (/(order|tracking|shipment|delivery|package)/.test(normalized)) {
    return "order";
  }
  if (/(error|bug|issue|login|password|technical|crash)/.test(normalized)) {
    return "technical";
  }
  return "product";
}

function buildReplies(
  input: string,
  flow: FlowKey,
  settings: BotSettings
): string[] {
  const normalized = input.toLowerCase();

  if (flow === "product") {
    if (/(price|pricing|plan|cost)/.test(normalized)) {
      return [
        "Great question. We typically guide teams into Starter, Growth, and Enterprise tiers based on monthly ticket volume and integration depth.",
        "For a portfolio demo, think $39 / $129 / custom pricing. If you share your support volume target, I can recommend the best fit.",
      ];
    }
    if (/(integration|shopify|slack|crm|zendesk|api)/.test(normalized)) {
      return [
        "We support direct integrations for Shopify, Stripe, HubSpot, and Slack-style alerts in production setups.",
        "If you want, I can outline a sample implementation sequence for your stack in under five steps.",
      ];
    }
    return [
      "Our platform is designed to automate repetitive support while preserving a human escalation path for sensitive requests.",
      "Would you like a quick feature comparison matrix or a sample onboarding timeline?",
    ];
  }

  if (flow === "order") {
    const orderId = input.match(/#?(\d{5,})/)?.[1];
    if (orderId) {
      const phaseIndex = Number(orderId.slice(-1)) % 3;
      const statuses = [
        "is being packed and should ship within 4 hours",
        "left the fulfillment center and is in transit",
        "is out for delivery and expected today",
      ];
      return [
        `I found order #${orderId}. It ${statuses[phaseIndex]}.`,
        "You’ll automatically receive a tracking update as soon as the next carrier scan is posted.",
      ];
    }
    return [
      "I can check that right away. Please share your order number (example: #204981) so I can give you a precise status update.",
      "If you prefer, I can also look it up using the purchase email and ZIP code.",
    ];
  }

  if (flow === "refund") {
    if (/(damaged|wrong|defect|broken)/.test(normalized)) {
      return [
        "I’m sorry about that. Damaged or incorrect items are eligible for priority refund or replacement.",
        "Share the order number and a quick photo, and we can usually complete approval within one business day.",
      ];
    }
    if (/(late|delay|not arrived)/.test(normalized)) {
      return [
        "Thanks for the context. If delivery misses the promised window, we can offer shipping reimbursement or a full refund based on policy.",
        "Send your order number and I’ll simulate the exact path we’d take in production.",
      ];
    }
    return [
      "Refunds are typically processed to the original payment method within 3-5 business days after approval.",
      "If you share your order number, I can walk through eligibility and the fastest refund path.",
    ];
  }

  if (/(login|password|auth|authentication)/.test(normalized)) {
    return [
      "Authentication errors are usually tied to expired session tokens or misaligned redirect URLs.",
      "Please clear session cookies, re-authenticate once, and verify callback URLs. If it persists, I can provide a focused debug checklist.",
    ];
  }

  if (/(slow|latency|performance|delay)/.test(normalized)) {
    return [
      "Understood. Slow responses are often caused by unoptimized widget scripts or heavy third-party tags on the host page.",
      "A quick audit of script order and lazy loading usually cuts perceived latency by 30-40%.",
    ];
  }

  return [
    `${settings.botName} is ready to help troubleshoot this.`,
    "Could you share the exact error text and what action triggers it? I’ll provide a step-by-step fix path.",
  ];
}

function createConversation(settings: BotSettings): Conversation {
  const timestamp = Date.now();
  return {
    id: nowMessageId(),
    title: "New Conversation",
    category: null,
    updatedAt: timestamp,
    messages: [
      {
        id: nowMessageId(),
        role: "bot",
        content: settings.welcomeMessage,
        timestamp,
      },
    ],
  };
}

function createDemoConversation(): Conversation {
  const end = Date.now();
  const start = end - 8 * 60_000;
  const step = (end - start) / 6;
  const messages: Array<Pick<Message, "role" | "content">> = [
    {
      role: "bot",
      content:
        "Hi! I can help with product details, order updates, refunds, and technical troubleshooting.",
    },
    { role: "user", content: "Hi, what are your pricing plans?" },
    {
      role: "bot",
      content:
        "We offer three plans: Starter ($39/mo), Growth ($129/mo), and Enterprise (custom). All include unlimited conversations and 24/7 AI support. Which fits your needs?",
    },
    { role: "user", content: "I need to request a refund for order #38291" },
    {
      role: "bot",
      content:
        "I found order #38291 placed 3 days ago. Refunds are processed within 3-5 business days to the original payment method. Initiating now!",
    },
    { role: "user", content: "Thank you, that is perfect!" },
    {
      role: "bot",
      content:
        "You are all set! Refund initiated, confirmation email on its way. Anything else I can help with?",
    },
  ];

  return {
    id: nowMessageId(),
    title: "Pricing & Refund Request",
    category: "refund",
    updatedAt: end,
    messages: messages.map((message, index) => ({
      id: nowMessageId(),
      role: message.role,
      content: message.content,
      timestamp: Math.round(start + step * index),
    })),
  };
}

function getConversationPreview(conversation: Conversation) {
  const latest = conversation.messages.at(-1);
  if (!latest) return "No messages yet";
  return latest.content;
}

export function ChatbotDemo() {
  const demoConversation = React.useRef<Conversation>(createDemoConversation()).current;
  const initialConversation = React.useRef<Conversation>(
    createConversation(DEFAULT_SETTINGS)
  ).current;

  const [settings, setSettings] = React.useState<BotSettings>(DEFAULT_SETTINGS);
  const [conversations, setConversations] = React.useState<Conversation[]>(() => [
    demoConversation,
    initialConversation,
  ]);
  const [activeConversationId, setActiveConversationId] = React.useState<string>(
    demoConversation.id
  );
  const [draft, setDraft] = React.useState("");
  const [typingConversationId, setTypingConversationId] = React.useState<string | null>(
    null
  );
  const [selectedFlow, setSelectedFlow] = React.useState<FlowKey | null>(null);
  const [widgetOpen, setWidgetOpen] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const copyResetTimeoutRef = React.useRef<number | null>(null);
  const messagesRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!conversations.some((conversation) => conversation.id === activeConversationId)) {
      setActiveConversationId(conversations[0]?.id ?? "");
    }
  }, [activeConversationId, conversations]);

  const activeConversation = React.useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [activeConversationId, conversations]
  );

  const isTyping = typingConversationId === activeConversationId;

  React.useEffect(() => {
    const target = messagesRef.current;
    if (target) {
      target.scrollTo({
        top: target.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeConversation?.messages.length, activeConversationId, isTyping]);

  const appendMessage = React.useCallback((conversationId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        const userMessageCount = conversation.messages.filter(
          (entry) => entry.role === "user"
        ).length;
        const nextTitle =
          message.role === "user" && userMessageCount === 0
            ? message.content.slice(0, 52)
            : conversation.title;
        return {
          ...conversation,
          title: nextTitle,
          updatedAt: message.timestamp,
          messages: [...conversation.messages, message],
        };
      })
    );
  }, []);

  const setConversationCategory = React.useCallback((conversationId: string, flow: FlowKey) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, category: flow } : conversation
      )
    );
  }, []);

  const createNewConversation = React.useCallback(() => {
    const nextConversation = createConversation(settings);
    setConversations((prev) => [nextConversation, ...prev]);
    setActiveConversationId(nextConversation.id);
    setSelectedFlow(null);
    setDraft("");
    setMobileSidebarOpen(false);
  }, [settings]);

  const copyEmbedSnippet = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMBED_SNIPPET);
      setCopied(true);
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
      copyResetTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2_000);
    } catch {
      setCopied(false);
    }
  }, []);

  const sendMessage = React.useCallback(
    async (value?: string, flowOverride?: FlowKey) => {
      if (!activeConversationId) return;
      if (typingConversationId === activeConversationId) return;
      const content = (value ?? draft).trim();
      if (!content) return;

      const now = Date.now();
      const userMessage: Message = {
        id: nowMessageId(),
        role: "user",
        content,
        timestamp: now,
      };
      appendMessage(activeConversationId, userMessage);
      setDraft("");

      const flow = inferFlow(content, flowOverride ?? selectedFlow);
      setSelectedFlow(flow);
      setConversationCategory(activeConversationId, flow);

      const replies = buildReplies(content, flow, settings);
      setTypingConversationId(activeConversationId);

      for (const reply of replies) {
        const dynamicDelay = Math.min(
          2_700,
          700 + reply.length * 15 + Math.floor(Math.random() * 420)
        );
        await delay(dynamicDelay);
        appendMessage(activeConversationId, {
          id: nowMessageId(),
          role: "bot",
          content: reply,
          timestamp: Date.now(),
        });
      }

      setTypingConversationId(null);
    },
    [
      activeConversationId,
      appendMessage,
      draft,
      selectedFlow,
      setConversationCategory,
      settings,
      typingConversationId,
    ]
  );

  const widgetPreviewMessages = React.useMemo(() => {
    const fallback = [
      { role: "bot" as const, content: settings.welcomeMessage },
      { role: "user" as const, content: "Can I return an item after 30 days?" },
      {
        role: "bot" as const,
        content: "Returns are accepted up to 45 days for unopened items. Want me to check your specific order policy?",
      },
    ];
    if (!activeConversation?.messages?.length) return fallback;
    const preview = activeConversation.messages.slice(-4).map((message) => ({
      role: message.role,
      content: message.content,
    }));
    return preview.length > 1 ? preview : fallback;
  }, [activeConversation?.messages, settings.welcomeMessage]);

  const brandStyle = { "--brand-color": settings.brandColor } as React.CSSProperties;

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 px-4 py-6 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100 sm:px-6 lg:px-10"
      style={brandStyle}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="mb-3 gap-1.5 bg-white/90 text-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
              <Sparkles className="size-3.5" />
              Portfolio Demo
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              AI Customer Support Chatbot
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Fully client-side simulation with realistic response timing, conversational
              flow presets, and customizable branding controls.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="chat">
          <TabsList>
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="size-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="widget" className="gap-2">
              <WalletCards className="size-4" />
              Widget Mode
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings2 className="size-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="size-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="grid gap-4 lg:grid-cols-[290px_1fr]">
              <Card className="hidden overflow-hidden lg:flex lg:flex-col">
                <SidebarContent
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={setActiveConversationId}
                  onCreateNew={createNewConversation}
                />
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800/70">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileSidebarOpen((prev) => !prev)}
                      >
                        {mobileSidebarOpen ? (
                          <X className="size-4" />
                        ) : (
                          <Menu className="size-4" />
                        )}
                      </Button>
                      <Avatar className="size-10 border border-slate-200 dark:border-slate-700">
                        <AvatarFallback>{settings.botAvatar.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{settings.botName}</CardTitle>
                        <CardDescription>Online now · typically replies in under 2s</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1.5">
                      <LifeBuoy className="size-3.5" />
                      Support AI
                    </Badge>
                  </div>
                </CardHeader>

                {mobileSidebarOpen && (
                  <div className="border-b border-slate-200/80 bg-slate-100/80 p-3 dark:border-slate-800/80 dark:bg-slate-900/70 lg:hidden">
                    <SidebarContent
                      conversations={conversations}
                      activeConversationId={activeConversationId}
                      onSelectConversation={(id) => {
                        setActiveConversationId(id);
                        setMobileSidebarOpen(false);
                      }}
                      onCreateNew={createNewConversation}
                      compact
                    />
                  </div>
                )}

                <CardContent className="p-0">
                  <div className="border-b border-slate-200/70 px-4 py-3 dark:border-slate-800/70 sm:px-5">
                    <div className="flex flex-wrap gap-2">
                      {FLOW_DEFINITIONS.map((flow) => {
                        const Icon = flow.icon;
                        const isActive = selectedFlow === flow.key;
                        return (
                          <button
                            key={flow.key}
                            type="button"
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                              isActive
                                ? "border-transparent text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            )}
                            style={isActive ? { backgroundColor: settings.brandColor } : undefined}
                            onClick={() => {
                              setSelectedFlow(flow.key);
                              void sendMessage(flow.starter, flow.key);
                            }}
                            disabled={isTyping}
                          >
                            <Icon className="size-3.5" />
                            {flow.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    ref={messagesRef}
                    className="h-[420px] space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4 dark:from-slate-900 dark:to-slate-950 sm:px-6"
                  >
                    {activeConversation?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "chat-enter flex w-full",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className="max-w-[85%] space-y-1 sm:max-w-[70%]">
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                              message.role === "user"
                                ? "rounded-br-md text-white"
                                : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                            )}
                            style={
                              message.role === "user"
                                ? { backgroundColor: settings.brandColor }
                                : undefined
                            }
                          >
                            {message.content}
                          </div>
                          <p
                            className={cn(
                              "text-xs text-slate-500 dark:text-slate-400",
                              message.role === "user" ? "text-right" : "text-left"
                            )}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="chat-enter flex w-full justify-start">
                        <div className="max-w-[65%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span className="typing-dot" />
                            <span className="typing-dot [animation-delay:140ms]" />
                            <span className="typing-dot [animation-delay:280ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200/70 bg-white p-4 dark:border-slate-800/70 dark:bg-slate-950 sm:p-5">
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void sendMessage();
                      }}
                    >
                      <Input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Ask about pricing, order #, refund policy, or technical issues..."
                        className="h-11"
                      />
                      <Button
                        type="submit"
                        className="h-11 px-4 text-white"
                        style={{ backgroundColor: settings.brandColor }}
                        disabled={isTyping || !draft.trim()}
                      >
                        <SendHorizontal className="size-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="widget">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Embedded Widget Preview</CardTitle>
                <CardDescription>
                  Simulates how your chatbot appears as a floating support widget on a customer
                  website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl dark:border-slate-800">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1e293b,_#020617_65%)] p-6">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-white/20 bg-white/90 p-5 shadow-lg backdrop-blur">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">Acme Commerce</h3>
                          <p className="text-sm text-slate-500">
                            Premium support for modern online brands.
                          </p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700">Live Support</Badge>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
                          Order tracking
                        </div>
                        <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
                          Refund portal
                        </div>
                        <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
                          Product knowledge
                        </div>
                      </div>
                    </div>
                  </div>

                  {widgetOpen && (
                    <div className="absolute bottom-24 right-5 flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl chat-enter dark:border-slate-800 dark:bg-slate-950 sm:right-8">
                      <div
                        className="flex items-center justify-between px-4 py-3 text-white"
                        style={{ backgroundColor: settings.brandColor }}
                      >
                        <div className="flex items-center gap-2">
                          <Bot className="size-4" />
                          <p className="text-sm font-semibold">{settings.botName}</p>
                        </div>
                        <button
                          type="button"
                          aria-label="Close widget"
                          onClick={() => setWidgetOpen(false)}
                          className="rounded-md p-1 transition-colors hover:bg-black/15"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3 dark:bg-slate-900">
                        {widgetPreviewMessages.map((message, index) => (
                          <div
                            key={`${message.content}-${index}`}
                            className={cn(
                              "flex",
                              message.role === "user" ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-sm",
                                message.role === "user"
                                  ? "rounded-br-md text-white"
                                  : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                              )}
                              style={
                                message.role === "user"
                                  ? { backgroundColor: settings.brandColor }
                                  : undefined
                              }
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                          <Input
                            className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
                            placeholder="Ask a question..."
                            disabled
                          />
                          <SendHorizontal className="size-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setWidgetOpen((prev) => !prev)}
                    className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] sm:bottom-8 sm:right-8"
                    style={{ backgroundColor: settings.brandColor }}
                  >
                    <MessageCircle className="size-4" />
                    {widgetOpen ? "Hide Chat" : "Chat with us"}
                  </button>
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <Label>Embed Code</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void copyEmbedSnippet();
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className="mt-2 rounded-lg bg-slate-900 p-4 text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre">{EMBED_SNIPPET}</pre>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chatbot Customization</CardTitle>
                  <CardDescription>
                    Personalize branding for demo clients in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="bot-name">Bot Name</Label>
                    <Input
                      id="bot-name"
                      value={settings.botName}
                      onChange={(event) =>
                        setSettings((prev) => ({ ...prev, botName: event.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bot-avatar">Avatar Initial / Emoji</Label>
                    <Input
                      id="bot-avatar"
                      value={settings.botAvatar}
                      maxLength={2}
                      onChange={(event) =>
                        setSettings((prev) => ({ ...prev, botAvatar: event.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Textarea
                      id="welcome-message"
                      value={settings.welcomeMessage}
                      onChange={(event) =>
                        setSettings((prev) => ({
                          ...prev,
                          welcomeMessage: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Brand Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Select ${color}`}
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              brandColor: color,
                            }))
                          }
                          className={cn(
                            "size-8 rounded-full border-2 transition-transform hover:scale-110",
                            settings.brandColor === color
                              ? "border-slate-900 dark:border-white"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
                        <Palette className="size-3.5" />
                        Custom
                        <input
                          type="color"
                          className="h-0 w-0 opacity-0"
                          value={settings.brandColor}
                          onChange={(event) =>
                            setSettings((prev) => ({
                              ...prev,
                              brandColor: event.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    Updates instantly as you modify branding and copy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                    <div
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-white"
                      style={{ backgroundColor: settings.brandColor }}
                    >
                      <Avatar className="size-9 border border-white/30">
                        <AvatarFallback className="bg-white/15 text-white">
                          {settings.botAvatar.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{settings.botName}</p>
                        <p className="text-xs text-white/90">Support Assistant</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      {settings.welcomeMessage}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Active Flows
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {FLOW_DEFINITIONS.map((flow) => (
                          <Badge key={flow.key} variant="outline" className="gap-1.5">
                            <flow.icon className="size-3.5" />
                            {flow.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {METRIC_CARDS.map((metric) => (
                  <Card key={metric.label}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
                        </div>
                        <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                          <metric.icon className="size-4" />
                        </div>
                      </div>
                      <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="size-3.5" />
                        {metric.delta} vs yesterday
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Conversation Volume</CardTitle>
                    <CardDescription>Hourly distribution for today</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CONVERSATIONS_BY_HOUR}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.25} />
                        <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                          }}
                        />
                        <Bar dataKey="conversations" fill={settings.brandColor} radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resolution Mix</CardTitle>
                    <CardDescription>Status distribution of active tickets</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={RESOLUTION_SPLIT}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={96}
                          innerRadius={56}
                          paddingAngle={2}
                        >
                          {RESOLUTION_SPLIT.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.name === "Resolved" ? settings.brandColor : entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Satisfaction Trend</CardTitle>
                  <CardDescription>Weekly customer CSAT score trajectory</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SATISFACTION_TREND}>
                      <defs>
                        <linearGradient id="csat" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={settings.brandColor}
                            stopOpacity={0.5}
                          />
                          <stop
                            offset="95%"
                            stopColor={settings.brandColor}
                            stopOpacity={0.04}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.25} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} domain={[85, 100]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke={settings.brandColor}
                        strokeWidth={2}
                        fill="url(#csat)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <p>Demo support interface for client presentations.</p>
          <a
            href="https://nackin.io"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-500 hover:underline dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            Powered by Nackin
          </a>
        </footer>
      </div>
    </main>
  );
}

type SidebarContentProps = {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onCreateNew: () => void;
  compact?: boolean;
};

function SidebarContent({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateNew,
  compact = false,
}: SidebarContentProps) {
  return (
    <>
      <div className={cn("border-b border-slate-200/70 p-4 dark:border-slate-800/70", compact && "p-3")}>
        <Button className="w-full justify-center gap-2" onClick={onCreateNew}>
          <Sparkles className="size-4" />
          New Conversation
        </Button>
      </div>

      <div className={cn("space-y-2 p-3", compact ? "max-h-52 overflow-y-auto" : "max-h-[570px] overflow-y-auto")}>
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          const flowLabel = FLOW_DEFINITIONS.find(
            (definition) => definition.key === conversation.category
          )?.label;

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left transition-all",
                isActive
                  ? "border-indigo-200 bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/10"
                  : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              )}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {conversation.title}
                </p>
                <p className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  {relativeTime(conversation.updatedAt)}
                </p>
              </div>
              <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                {getConversationPreview(conversation)}
              </p>
              {flowLabel ? (
                <Badge variant="outline" className="mt-2 text-[10px]">
                  {flowLabel}
                </Badge>
              ) : null}
            </button>
          );
        })}
      </div>
      {!compact && (
        <>
          <Separator />
          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" />
              Agent View
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bot className="size-3.5" />
              AI Enabled
            </span>
          </div>
        </>
      )}
    </>
  );
}
